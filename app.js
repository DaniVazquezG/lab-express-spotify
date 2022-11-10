require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const http = require('http');
const server = http.createServer();


const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get('/', (req, res, next) => res.render('index'))

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const { items } = data.body.artists
            console.log('The received data from the API: ', data.body)
            res.render('artist-search', { items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const { items } = data.body
            console.log('Artist albums', items);

            spotifyApi.getArtist(artistId)
                .then(function (data) {
                    const { name } = data.body;
                    res.render('albums', { items, name });
                }, function (err) {
                    console.error(err);
                });
        })
        .catch(err => console.error(err));
});







const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

module.exports = app;





