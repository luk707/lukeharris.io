import axios from "axios";
import mysql from "promise-mysql";
import moment from "moment";
import querystring from "querystring";
import { config } from "dotenv";
import path from "path";

// Get environment files
config(path.resolve(__dirname, "..", ".env"));

// These used to be hard coded up here but now there aliasing the env file
// because im lazy
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const refresh_token = process.env.REFRESH_TOKEN;

// link track to album
const linkTrackToAlbum = async (track, album, connection) => {
  console.log(`Linking track "${track.name}" to album "${album.name}"...`);
  const [id] = await connection.query(`
    SELECT * FROM album_tracks WHERE album = ${connection.escape(
      album.id
    )} AND track = ${connection.escape(track.id)}
  `);
  if (id) {
    console.log(
      `Track "${track.name}" already linked to album "${album.name}"`
    );
    return;
  }
  const { insertId } = await connection.query(`
    INSERT INTO album_tracks (
      album, track
    ) VALUES (
      ${connection.escape(album.id)},
      ${connection.escape(track.id)}
    )
  `);
  console.log(`Linked track "${track.name}" to album "${album.name}"`);
};

// links artist to album
const linkArtistToAlbum = async (artist, album, connection) => {
  console.log(`Linking artist "${artist.name}" to album "${album.name}"...`);
  const [id] = await connection.query(`
    SELECT * FROM album_artists WHERE album = ${connection.escape(
      album.id
    )} AND artist = ${connection.escape(artist.id)}
  `);
  if (id) {
    console.log(
      `Artist "${artist.name}" already linked to album "${album.name}"`
    );
    return;
  }
  const { insertId } = await connection.query(`
    INSERT INTO album_artists (
      album, artist
    ) VALUES (
      ${connection.escape(album.id)},
      ${connection.escape(artist.id)}
    )
  `);
  console.log(`Linked artist "${artist.name}" to album "${album.name}"`);
};

// links artist to track in briding table
const linkArtistToTrack = async (artist, track, connection) => {
  console.log(`Linking artist "${artist.name}" to track "${track.name}"...`);
  const [id] = await connection.query(`
    SELECT * FROM track_artists WHERE track = ${connection.escape(
      track.id
    )} AND artist = ${connection.escape(artist.id)}
  `);
  if (id) {
    console.log(
      `Artist "${artist.name}" already linked to track "${track.name}"`
    );
    return;
  }
  const { insertId } = await connection.query(`
    INSERT INTO track_artists (
      track, artist
    ) VALUES (
      ${connection.escape(track.id)},
      ${connection.escape(artist.id)}
    )
  `);
  console.log(`Linked artist "${artist.name}" to track "${track.name}"`);
};

// saves artist to database if it does not yet exist
const saveArtist = async (artist, connection) => {
  console.log(`Saving artist "${artist.name}"...`);
  const [id] = await connection.query(`
    SELECT * FROM artists WHERE id = ${connection.escape(artist.id)}
  `);
  if (id) {
    console.log(`Artist "${artist.name}" already exists`);
    return;
  }
  const { insertId } = await connection.query(`
    INSERT INTO artists (
      id, href, name, type, uri
    ) VALUES (
      ${connection.escape(artist.id)},
      ${connection.escape(artist.href)},
      ${connection.escape(artist.name)},
      ${connection.escape(artist.type)},
      ${connection.escape(artist.uri)}
    )
  `);
  console.log(`Saved artist "${artist.name}"`);
};

// saves album to database if it does not already exist
const saveAlbum = async (album, connection) => {
  for (const artist of album.artists) {
    await saveArtist(artist, connection);
    await linkArtistToAlbum(artist, album, connection);
  }
  console.log(
    `Saving album "${album.name}" by ${album.artists
      .map(artist => `"${artist.name}"`)
      .join()}...`
  );
  const [id] = await connection.query(`
    SELECT * FROM albums WHERE id = ${connection.escape(album.id)}
  `);
  if (id) {
    console.log(
      `Album "${album.name}" by ${album.artists
        .map(artist => `"${artist.name}"`)
        .join()} already exists`
    );
    return;
  }
  for (const image of album.images) {
    const { insertId } = await connection.query(`
      INSERT INTO images (
        width, height, url
      ) VALUES (
        ${connection.escape(image.width)},
        ${connection.escape(image.height)},
        ${connection.escape(image.url)}
      )
    `);
    await connection.query(`
      INSERT INTO album_images (
        album, image
      ) VALUES (
        ${connection.escape(album.id)},
        ${connection.escape(insertId)}
      )
    `);
  }
  await connection.query(`
    INSERT INTO albums (
      id, album_type, href, name, type, uri
    ) VALUES (
      ${connection.escape(album.id)},
      ${connection.escape(album.album_type)},
      ${connection.escape(album.href)},
      ${connection.escape(album.name)},
      ${connection.escape(album.type)},
      ${connection.escape(album.uri)}
    )
  `);
  console.log(
    `Saved album "${album.name}" by ${album.artists
      .map(artist => `"${artist.name}"`)
      .join()}`
  );
};

// Saves track to database if it does not yet exist
const saveTrack = async (track, connection) => {
  for (const artist of track.artists) {
    await saveArtist(artist, connection);
    await linkArtistToTrack(artist, track, connection);
  }
  await saveAlbum(track.album, connection);
  await linkTrackToAlbum(track, track.album, connection);
  console.log(
    `Saving track "${track.name}" by ${track.artists
      .map(artist => `"${artist.name}"`)
      .join()}...`
  );
  const [id] = await connection.query(`
    SELECT * FROM tracks WHERE id = ${connection.escape(track.id)}
  `);
  if (id) {
    console.log(
      `Track "${track.name}" by ${track.artists
        .map(artist => `"${artist.name}"`)
        .join()} already exists`
    );
    return;
  }
  const { insertId } = await connection.query(`
    INSERT INTO tracks (
      id, name, popularity, preview_url, track_number, type, uri, explicit, duration_ms, disc_number
    ) VALUES (
      ${connection.escape(track.id)},
      ${connection.escape(track.name)},
      ${connection.escape(track.popularity)},
      ${connection.escape(track.preview_url)},
      ${connection.escape(track.track_number)},
      ${connection.escape(track.type)},
      ${connection.escape(track.uri)},
      ${connection.escape(track.explicit)},
      ${connection.escape(track.duration_ms)},
      ${connection.escape(track.disc_number)}
    )
  `);
  console.log(
    `Saved track "${track.name}" by ${track.artists
      .map(artist => `"${artist.name}"`)
      .join()}`
  );
};

// Saves each session
const savePlay = async (track, played_at, connection) => {
  const timestamp = moment(new Date(played_at)).format("YYYY-MM-DD HH:mm:ss");
  const [id] = await connection.query(`
    SELECT * FROM plays WHERE id = ${connection.escape(timestamp)}
  `);
  if (id) {
    console.log("play already logged");
    return;
  }
  const { insertId } = await connection.query(`
    INSERT INTO plays (
      id, track
    ) VALUES (
      ${connection.escape(timestamp)},
      ${connection.escape(track.id)}
    )
  `);
};

const getPlays = async (access_token, next) => {
  const { data } = await axios.get(
    next || "https://api.spotify.com/v1/me/player/recently-played",
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }
  );
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  for (const { track, played_at } of data.items) {
    await saveTrack(track, connection);
    await savePlay(track, played_at, connection);
  }
  connection.end();
  return data.next;
};

const getAccessToken = () =>
  // Get a token
  axios
    .post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token
      }),
      { auth: { username: client_id, password: client_secret } }
    )
    // return it
    .then(({ data }) => data.access_token)
    // log any errors
    .catch(({ data }) => console.log(data));

const getAllSessions = async () => {
  // gets the access token
  const access_token = await getAccessToken();
  // spotify returns the next endpoint to hit, store it here
  let next = undefined;
  let finished = false;
  // hit the api until no more results are returned
  while (!finished) {
    console.log(
      next
        ? `
      ************************************
      Getting ${next}
      ************************************
      `
        : `
      ************************************
      Getting spotify playlist information
      Time: ${moment().format("YYYY-MM-DD HH:mm:ss")}
      ************************************
      `
    );
    const currentNext = next;
    // get the plays
    next = await getPlays(access_token, next);
    // if dont have any more results end
    if (!!currentNext && !next) {
      console.log("Finished");
      finished = true;
    }
  }
};

// Start it up
getAllSessions();
