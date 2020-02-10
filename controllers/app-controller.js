// Gather dependencies
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

// Require models
const db = require('../models');

module.exports = function (app) {
    // Create GET route for scraping website
    app.get("/", function (req, res) {
        // Grab the html body of webpage with axio
        axios.get("http://google.com/").then(function (response) {
            // Use cheerio to load and save metadata as a $ JQuery selector
            let $ = cheerio.load(response.data);

            // Save an empty result as object; 
            const result = {};
            // Add the text 

            //Create a new Article using the 'result' object in database
            db.Article.create(result)
                .then(function (dbArticle) {
                    // Confirm that result has been created
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // Log the error
                    console.log(err);
                });
            // Send an OK confirmation to the client
            res.send('Successful Scraping - YAH YEET')
        });
    });

      // Route for getting all Articles from the the db
      app.get("/articles", function(req, res) {
        // Grab all documents from Articles collection
        db.Article.find({})
        .then(function(dbArticle) {
            // Send all articles to display
            res.json(dbArticle);
        })
        // If error occurred, send to client
        .catch(function(err) {
            console.log(err);
        });
    });

    app.listen(PORT, function() {
        console.log(`App is running on PORT ${PORT}!`)
    })


}
