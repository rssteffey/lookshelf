const express = require('express');
const path = require('path');
const request = require('request');
const ISBN = require("isbn3");

const app = express();
const port = process.env.PORT || 8080;

const { readFileSync } = require('fs');
const { parse } = require('path');
const credentials = JSON.parse(readFileSync('./credentials/creds.json'));

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/isbn/:isbn', function(req, res) {

    var parsedISBN = ISBN.parse(req.params.isbn);
    console.log(parsedISBN);

    // Hit Google Books API
    var apiString = "https://www.googleapis.com/books/v1/volumes?q=isbn:"
    var requestString = apiString + parsedISBN.isbn13 + "&key=" + credentials.books_api_key;

    console.log(requestString);

    
    request(requestString, function (error, response, body) {

        //console.log('body:', body); // Print the HTML for the Google homepage.

        books_metadata = JSON.parse(body);
        book = books_metadata.items[0].volumeInfo;

        res.json({
            title: book.title,
            author: book.authors[0],
            year: book.publishedDate
        });
    });
});

app.listen(port);
console.log('Server started at http://localhost:' + port);