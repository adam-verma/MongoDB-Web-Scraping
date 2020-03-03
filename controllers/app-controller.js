// Gather dependencies
const axios = require('axios');
const cheerio = require('cheerio');

 // Require models
 let db = require("../models/");

module.exports = function (app) {

    // Create GET route for scraping website
    app.get("/scrape", function (req, res) {
        // Get the html body of the /all-parks route
        axios.get("https://tpwd.texas.gov/state-parks/nearby/all-parks").then(function (response) {
            // Use cheerio to load and store the links for further scraping
            let $ = cheerio.load(response.data);

            let urlArr = [];
            $(".external-link").each(function (index) {
                if ($(this).parent().attr("href")) {
                    urlArr.push($(this).parent().attr("href"))
                }
            });
            console.log(urlArr);

            // ScrapePages(url).reduce((prev, urlArr) => prev.then(
            //     () => ScrapePages(url).add(urlArr),
            // ), Promise.resolve());

            const scrapeLinks = urlArr.map(ScrapePages);    
            res.send("Scrape Complete");
        });
    });

        // 
        function ScrapePages(url) {
            axios.get(url)
                .then(function (response) {
                    let $ = cheerio.load(response.data);
                    let parkInfo = {};
                    parkInfo.name = $('#parkheader').find("#sp_title").children().children("a").text().replace(/[\n\r]\s+/gi, ' ').trim();
                    $('#right-column').each(function (i, element) {
                        parkInfo.address = $(this).find("address").text().replace(/(\r\n|\n|\r|\t|\s+)/gm, ' ').trim();
                        parkInfo.phone = $(this).find(".park_phone").children("p").text().replace(/(\r\n|\n|\r|\t|\s+)/gm, ' ');
                        parkInfo.fees = $(this).children().children("#parkfees").children(".rowcontent").children("ul").children("li").text().replace(/(\r\n|\n|\r|\t|\s+)/gm, ' ').trim();
                        parkInfo.hours = $(this).children().children("#parkhours").children().children("p").text().replace(/(\r\n|\n|\r|\t|\s+)/gm, ' ').trim();
                        parkInfo.climate = $(this).children().children("#parkclimate").children().children("p").text().replace(/[\n\r]\s+/gi, ' ').trim();
                    })
                    console.log(parkInfo);

                    // Create a new Article using the `parkInfo` object built from scraping
                    db.Article.create(parkInfo)
                        .then(function (dbArticle) {
                            // View the added result in the console
                            console.log(dbArticle);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                    // Send a message to the client
                     
                });
        };
      
      // Grabs all articles that are not saved and renders to the index.html
      app.get("/", function(req, res){
        db.Article.find({saved: false})
        .then(function(result){
            const hbsObj = {articles: result};
            res.render("index", hbsObj);
        })
        .catch(function(err) { 
            res.json(err);
        });
    });


    // Grabs all saved articles attached with notes and renders to the saved page 
    app.get("/saved", function(req, res) {
        db.Article.find({saved: true})
        .sort({date: -1})
        .populate("note")
        .then(function(dbArticle) {
            const hbsObj = {savedArticle: dbArticle};
            res.render('index', hbsObj);
        })
        .catch(function(err) {
            res.json(err)
        });
    });

    app.post("/savedArticle/:id", function(req, res) {
        db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {saved: true})
        .then(function(savedArticle) {
            res.json(savedArticle)
        })
        .catch(function(err) {
            console.log(err);
        })
        })
    
    // Route for getting all Articles from the the db
    app.get("/articles", function (req, res) {
        // Grab all documents from Articles collection
        db.Article.find(req.query)
            .then(function (dbArticle) {
                // Send all articles to display
                res.json(dbArticle);
            })
            // If error occurred, send to client
            .catch(function (err) {
                console.log(err);
            });
    });

    // Route for getting an Article by id
    app.get("/articles/:id", function (req, res) {
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
    app.post("/deleteArticle/:id", function(req, res){
      
        db.Article.findOneAndRemove({
            _id: req.params.id
        })
        .then(function() {
            return db.Note.remove({});
        })
        .then(function(results) {
            res.json(results);
        })
        .catch(function(err) { 
            res.json(err) 
        });
    });

    app.post("/savedNote/:id", function (req, res) {
        // Create a new note to pass req.body to 
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note is created, find the Article Id that matches req.params.id and update that associated Id to the new Note through 'note' ref
                db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id
                }, {
                    new: true
                });
            })
            // If the article is updated successfully, create an asynch function that sends data to client
            .then(function (dbArticle) {
                res.json(dbArticle)
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