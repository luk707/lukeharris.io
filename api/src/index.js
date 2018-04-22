import express from "express";
import mysql from "promise-mysql";
import graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import moment from "moment";
import { config } from "dotenv";
import path from "path";

// Get environment files
config(path.resolve(__dirname, "..", ".env"));

const app = express();

// Should realy use a pool, but this works for now
const createConnection = () =>
  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

const enumerateDaysBetweenDates = (startDate, endDate) => {
  const dates = [];

  const currDate = moment(startDate).startOf("day");
  const lastDate = moment(endDate).endOf("day");
  dates.push(currDate.clone().toDate());
  while (currDate.add(1, "days").diff(lastDate) < 0) {
    dates.push(currDate.clone().toDate());
  }

  return dates;
};

class Image {
  constructor({ id, width, height, url }) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.url = url;
  }
  static async Get({ id }) {
    const connection = await createConnection();
    const [image] = await connection.query(`
      SELECT * FROM images WHERE id = ${connection.escape(id)}
    `);
    await connection.end();
    return new Image(image);
  }
}

class Album {
  constructor({ id, album_type, href, name, type, uri }) {
    this.id = id;
    this.album_type = album_type;
    this.href = href;
    this.name = name;
    this.type = type;
    this.uri = uri;
  }
  static async Get({ id }) {
    const connection = await createConnection();
    const [album] = await connection.query(`
      SELECT * FROM albums WHERE id = ${connection.escape(id)}
    `);
    await connection.end();
    return new Album(album);
  }
  async images() {
    const connection = await createConnection();
    const images = await connection.query(`
      SELECT * FROM album_images WHERE album = ${connection.escape(this.id)}
    `);
    await connection.end();
    return images.map(Image.Get);
  }
}

class Artist {
  constructor({ id, href, name, type, uri }) {
    this.id = id;
    this.href = href;
    this.name = name;
    this.type = type;
    this.type = uri;
  }
  static async Get({ id }) {
    const connection = await createConnection();
    const [artist] = await connection.query(`
      SELECT * FROM artists WHERE id = ${connection.escape(id)}
    `);
    await connection.end();
    return new Artist(artist);
  }
}

class Track {
  constructor({
    id,
    name,
    popularity,
    preview_url,
    track_number,
    type,
    uri,
    explicit,
    duration_ms,
    disc_number
  }) {
    this.id = id;
    this.name = name;
    this.popularity = popularity;
    this.preview_url = preview_url;
    this.track_number = track_number;
    this.type = type;
    this.uri = uri;
    this.explicit = explicit;
    this.duration_ms = duration_ms;
    this.disc_number = disc_number;
  }
  static async Get({ id }) {
    const connection = await createConnection();
    const [track] = await connection.query(`
      SELECT * FROM tracks WHERE id = ${connection.escape(id)}
    `);
    await connection.end();
    return new Track(track);
  }
  static async MostStreamed() {
    const connection = await createConnection();
    const allTimeTopPlayedTracks = await connection.query(`
      SELECT count(id) as count, track FROM plays GROUP BY track ORDER BY count DESC LIMIT 20
    `);
    await connection.end();
    return allTimeTopPlayedTracks.map(({ count, track }) => ({
      count,
      track: Track.Get({ id: track })
    }));
  }
  static async RecentlyStreamed() {
    const connection = await createConnection();
    const recentlyStreamedTracks = await connection.query(`
      SELECT id as time, track FROM plays ORDER BY id DESC LIMIT 20
    `);
    await connection.end();
    return recentlyStreamedTracks.map(({ time, track }) => ({
      time,
      track: Track.Get({ id: track })
    }));
  }
  async artists() {
    const connection = await createConnection();
    const artists = await connection.query(`
      SELECT * FROM track_artists WHERE track = ${connection.escape(this.id)}
    `);
    await connection.end();
    return artists.map(({ artist }) => Artist.Get({ id: artist }));
  }
  async album() {
    const connection = await createConnection();
    const [{ album }] = await connection.query(`
      SELECT * FROM album_tracks WHERE track = ${connection.escape(this.id)}
    `);
    await connection.end();
    return Album.Get({ id: album });
  }
}

const schema = buildSchema(`
  type Image {
    id: ID
    width: Int
    height: Int
    url: String
  }
  type Album {
    id: ID
    album_type: String
    href: String
    name: String
    type: String
    uri: String
    images: [Image]
  }
  type Artist {
    id: ID
    href: String
    name: String
    type: String
    uri: String
  }
  type Track {
    id: ID
    name: String
    popularity: Int
    preview_url: String
    track_number: Int
    type: String
    uri: String
    explicit: Boolean
    duration_ms: Int
    disc_number: Int
    artists: [Artist]
    album: Album
  }
  type StreamTime {
    time: String
    track: Track
  }
  type StreamCount {
    count: Int
    track: Track
  }
  type MusicQuery {
    track(id: ID): Track
    artist(id: ID): Artist
    album(id: ID): Album
    recentlyStreamed: [StreamTime]
    mostStreamed: [StreamCount]
  }
  type Query {
    music: MusicQuery
  }
`);

app.use(
  "/",
  graphqlHTTP({
    schema,
    rootValue: {
      music: {
        track: Track.Get,
        artist: Artist.Get,
        mostStreamed: Track.MostStreamed,
        recentlyStreamed: Track.RecentlyStreamed
      }
    },
    graphiql: true
  })
);

app.listen(3000);
