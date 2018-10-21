require("dotenv").config();

// Variable for importing keys.js
let keys = require("./keys");

// Environmental variables

const request = require('request');
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);
let moment = require('moment');
let fs = require('fs');

let input1 = process.argv[2];
let input2 = process.argv.slice(3).join("+");

//Concert function
function getConcert(term) {

    let bandName = term

    //build query URL
    let queryURL = 'https://rest.bandsintown.com/artists/' + bandName + '/events?app_id=codingbootcamp';


    request(queryURL, function (err, response, data) {
        if (err) {
            console.log('error:', err);
        }

        let bandJ = JSON.parse(data);

        for (i = 0; i < bandJ.length; i++) {
            let venue = bandJ[i].venue.name
            let country = bandJ[i].venue.country
            let city = bandJ[i].venue.city

            //display concert information
            console.log('Venue: ' + venue);
            console.log('Location: ' + city + ', ' + country);
            console.log('Date: ' + moment(bandJ[i].datetime).format('L'));
            console.log('------------------------------')
        }

    })
}

//Movie function

function getMovie(term) {
    let movie = term;

    let queryURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + movie + '';

    if (queryURL === 'http://www.omdbapi.com/?apikey=trilogy&t=') {
        queryURL = 'http://www.omdbapi.com/?apikey=trilogy&t=Mr.+Nobody';
    }

    request(queryURL, function (err, response, data) {
        if (err) {
            console.log(err);
        }

            filmJ = JSON.parse(data);
            

            //display information
            console.log('Title: ' + filmJ.Title);
            console.log('Year Released: ' + filmJ.Year);
            console.log('IMDb Rating: ' + filmJ.Ratings[0].Value);
            console.log('Rotten Tomatoes Rating: ' + filmJ.Ratings[1].Value);
            console.log('Location of Movie Production' + filmJ.Country);
            console.log('Language: ' + filmJ.Language);
            console.log('Plot: ' + filmJ.Plot);
            console.log('Cast: ' + filmJ.Actors);
        
    })



}

//Do what it says function

function doWhat() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        let dataArr = data.trim().split(',');
        
        runCMD(dataArr[0], dataArr[1]);


        

        

    })
}



// spotify function

function getSpotify(term) {

    let songTitle = term

    //if user doesn't enter anything

    if (songTitle == '') {

        spotify.search({
            type: 'track',
            query: "The Sign Ace of Base",
            limit: 1
        },
            function (err, data) {

                if (err) {
                    console.log(err);
                }

                let song = data.tracks.items;

                let artist = song[0].album.artist[0].name;
                let title = song[0].name;
                let link = song[0].album.external_urls.spotify;
                let album = song[0].album.name;

                //display information
                console.log('Artist: ' + artist);
                console.log('Title: ' + title);
                console.log('Preview Link: ' + link);
                console.log('Album: ' + album);
                console.log('-------------------------')



            });
    }
    else {
        spotify.search({
            type: 'track',
            query: songTitle,
            limit: 1
        },
            function (err, data) {

                if (err) {
                    console.log(err);
                }

                let song = data.tracks.items;

                let artist = song[0].album.artists[0].name;
                let title = song[0].name;
                let link = song[0].album.external_urls.spotify;
                let album = song[0].album.name;

                //display information
                console.log('Artist: ' + artist);
                console.log('Title: ' + title);
                console.log('Preview Link: ' + link);
                console.log('Album: ' + album);
                console.log('-------------------------')

            });

    }

}

function runCMD(task, term) {
    switch (task) {
        case "spotify-this-song":
            getSpotify(term);
            break;

        case "concert-this":
            getConcert(term);
            break;

        case "movie-this":
            getMovie(term);
            break;
        case "do-what-it-says":
            doWhat();
            break;
    }
}



runCMD(input1, input2);
