// Gather dependencies
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

 // Require models
 let db = require("../models/");

module.exports = function (app) {

    // Create GET route for scraping website
    app.get("/scrape", function (req, res) {
        // Get the html body of the /all-parks route
        axios.get("https://tpwd.texas.gov/state-parks/nearby/all-parks").then(function (response) {
            // Use cheerio to load and store the links for further scraping
            let $ = cheerio.load(response.data);
            console.log($);
            let urlArr = [];
            $(".external-link").each(function (index) {
                if ($(this).parent().attr("href")) {
                    urlArr.push($(this).parent().attr("href"))
                }
            });
            urlArr = urlArr.filter(function(arr){ 
                return arr !== undefined
            })

            let promises = [];
            urlArr.forEach(url =>  {
                promises.push(new Promise((resolve, reject) => {
                    axios.get(url)
                    .then(function (response) {
                        let $ = cheerio.load(response.data);
                        let parkInfo = [];
                        parkInfo.url = url;
                        parkInfo.name = $('#parkheader').find("#sp_title").children().children("a").text().replace(/[\n\r]\s+/gi, ' ').trim();
                        parkInfo.image = $('.orbit-image').attr('src');
                        $('#right-column').each(function (i, element) {
                            parkInfo.address = $(this).find(".address").text().replace(/(\r\n|\n|\r|\t|\s+)/gm, ' ').trim();
                            parkInfo.phone = $(this).find(".park_phone").children("p").text().replace(/(\r\n|\n|\r|\t|\s+)/gm, ' ');
                            parkInfo.fees = $(this).children().children("#parkfees").children(".rowcontent").children("ul").children("li").text().replace(/(\r\n|\n|\r|\t|\s+)/gm, ' ').trim();
                            parkInfo.hours = $(this).children().children("#parkhours").children().children("p").text().replace(/(\r\n|\n|\r|\t|\s+)/gm, ' ').trim();
                            parkInfo.climate = $(this).children().children("#parkclimate").children().children("p").text().replace(/[\n\r]\s+/gi, ' ').trim();
                        })
                        if (parkInfo.name !== "" && parkInfo.image !="" && parkInfo.address !== "" && parkInfo.phone !== "" && parkInfo.fees !== "" && parkInfo.hours !== "" && parkInfo.climate !== "" ) {
                            parkInfo.push(parkInfo);
                        }
                        // Send a message to the client
                        return resolve(parkInfo)
                    })
                }))
            });

            Promise.all(promises)
            .then((results) => {
                // Create a new Article using the `parkInfo` object built from scraping
                db.Article.create(results, function(err, parkname) {
                    // If duplicate error code, then find duplicate by name and filter out 
                    if (err && err.code === 11000) {
                        console.log('found dups');
                        return db.Article.find({name: results.name}).exec()
                    }
                    else {
                        console.log('new article created', results.name);
                    }  
                })
                return res.redirect('/')
            })
        })
    })

      // Grabs all articles that are not saved and renders to the index.html
      app.get("/", function(req, res){
        db.Article.find({saved: false}).lean()
        .then(result => {
                const hbsObj = {articles: result};
                console.log(`hbs: ${hbsObj}`);
                res.render("index", hbsObj);
            })
        .catch(err => {
            console.log(err)
        })
    });

    // Grabs all saved articles attached with notes and renders to the saved page 
    app.get("/saved", function(req, res) {
        db.Article.find({saved: true}).lean()
        .sort({date: -1})
        .populate("note")
        .then(function(dbArticle) {
            const savedObj = {savedArticle: dbArticle};
            res.render('saved', savedObj);
        })
        .catch(function(err) {
            res.json(err)
        });
    });

    app.put("/saved/:id", function(req, res) {
        db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {$set: {saved: true}})
        .then(function(savedArticle) {
            console.log('good job')
            res.redirect('/');
        })
        .catch(function(err) {
            console.log(err);
        })
        })

    // Route for getting an Article by id
    app.get("/saved/:id", function (req, res) {
        db.Article.find({
                _id: req.params.id
            })
            .populate("note")
        // Send to client if query was successful
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
    })

    // Use a post route to delete specified article
    app.put("/deleteArticle/:id", function(req, res){
      
        db.Article.findOneAndUpdate({
            _id: req.params.id, 
        }, {$set: {saved: false}})
        .then(function() {
            return db.Note.remove({});
        })
        .then(function() {
            console.log('deleted')
            res.redirect('/saved');
        })
        .catch(function(err) { 
            res.json(err) 
        });
    });

    // Use a post route to delete all articles
    app.delete("/deleteArticles", function(req, res) {
        db.Article.deleteMany({})
        .then(function(deletedArticles) {
            res.send(deletedArticles)
        })
        .catch(function(err) {
            res.json(err)
        });
    });

    app.post("/savedNote/:id", function (req, res) {
        console.log(req.body);
        console.log('id'+req.params.id);
        // Create a new note to pass req.body to 
        db.Note.create(req.body)
            .then(function (dbNote) {
                console.log('NoteId: '+dbNote._id);
                // If a Note is created, find the Article Id that matches req.params.id and update that associated Id to the new Note through 'note' ref
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id, 
                }, {
                    new: true
                });
            })
                // If the article is updated successfully, create an asynch function that sends data to client
                .then(function (dbArticle) {
                    console.log(dbArticle)
                })
                // If the article does not update, then catch error 
                .catch(function (err) {
                    res.json(err)
                });
    });
    
    // app.post("/deletedNote/:id", function(req, res) {
    //     // Find Note by id to delete
    //     db.Note.findOneAndRemove({
    //         _id: req.params.id
    //     })
    //     .then(function(dbNote) {
    //         res.json(dbNote)
    //     })
    //     .catch(function(error) {
    //         res.json(error)
    //     });
    // });
}