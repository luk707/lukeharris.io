# Spotify Importer

So spotify personal statistics are shit. They do not give me near the same amount of information that you get in apple music. So this is more of a personal tool to keep myself a little more sane, but feel free to use it for yourself.

This script hits the spotify recently played endpoint and uses it to populate a database of personal statistics.

See the api project to see what kind of aggregations you can do on this data.

_This was written in one evening, if ur judging me; pls dont ;)_

## Setting up the database

This script uses mysql for storing data.

I have added the table structure the code relies on in `spotify.sql` in the root of this project folder. You will need to import this into your database before you can run the script.

## Setting up the environment

Install envup: `npm i envup -g` and run it in the command line. This will ask you the information you need to save into the environment file and write it for you.

You will need to obtain a client id and secret from spotify. You will also need to generate an access token with the scope `user-read-recently-played`. _Warning: this step is a pain in the ass. You need to setup a server to catch to authorization code and then capture a refresh token for yourself._

## Build and run the script

Run `npm run build` and it should generate an index file in a new directory called lib inside the spotify-importer project. Run this file and you should see it import all your recently played music into the database.
