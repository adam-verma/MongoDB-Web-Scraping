// Dependencies
const express = require('express');
const logger = require('logger');
const mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
var db = require("./models");

const PORT = 3000; 

// Initialize Express
const app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname +'/public'));

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to Mongo DB
mongoose.connect("mongodb://localhost/webscrapingdb", { useNewUrlParser: true });

// Start server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  