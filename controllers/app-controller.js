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

     // Route for getting an Article by id
     app.get("/articles/:id", function(req, res) {
        db.Article.find({_id: req.params.id})
        .populate("note")
        // Send to client if query was successful
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            console.log(err); 
        });
    })

    app.post("/articles/:id", function(req, res) {
        // Create a new note to pass req.body to 
        db.Note.create(req.body)
        .then(function(dbNote) {
            // If a Note is created, find the Article Id that matches req.params.id and update that associated Id to the new Note through 'note' ref
            db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new:true});
        })
            // If the article is updated successfully, create an asynch function that sends data to client
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
            // If the article does not update, then catch error 
        .catch(function(err) {
            res.json(err)
        });
    });

}
