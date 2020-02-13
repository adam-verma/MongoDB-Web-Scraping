// Dependencies
const express = require('express');
const mongoose = require("mongoose");

const PORT = 3000; 

// Initialize Express
const app = express();

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname +'/public'));

// Set Handlebars.
const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscrapingdb"
// Connect to Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, err => { if(err) { console.log(err); }});

require("./controllers/app-controller.js")(app);

// Start server
app.listen(PORT, function() {
  console.log(`App is running on PORT ${PORT}!`)
})