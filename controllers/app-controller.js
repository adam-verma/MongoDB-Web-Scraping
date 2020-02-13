// Gather dependencies
const axios = require('axios');
const cheerio = require('cheerio');

 // Require models
 let db = require("../models/");

module.exports = function (app) {
   
    // Create GET route for scraping website
    app.get("/", function (req, res) {
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
            const scrapeLinks = urlArr.map(ScrapePages);

        });
        
        // 
        function ScrapePages(url) {
            axios.get(url)
                .then(function (response) {
                    let $ = cheerio.load(response.data);
                    let parkInfo = {};
                    parkInfo.name = $('#parkheader').find("#sp_title").children().children("a").text().replace(/[\n\r]\s+/gi, ' ').trim();
                    $('#right-column').each(function (i, element) {
                        parkInfo.address = $(this).find("address").text().replace(/[\n\r]\s+/gi, ' ').trim();
                        parkInfo.phone = $(this).find(".park_phone").children("p").text().replace(/[\n\r]\s+/gi, ' ');
                        parkInfo.fees = $(this).children().children("#parkfees").children(".rowcontent").children("ul").children("li").text().replace(/[\n\r]\s+/gi, ' ').trim();
                        parkInfo.hours = $(this).children().children("#parkhours").children().children("p").text().replace(/[\n\r]\s+/gi, '').trim();
                        parkInfo.climate = $(this).children().children("#parkclimate").children().children("p").text().replace(/[\n\r]\s+/gi, ' ').trim();
                    })
                    console.log(parkInfo);

                    console.log(db.Article.create());
                    // // Create a new Article using the `parkInfo` object built from scraping
                    // db.Article.create(parkInfo)
                    //     .then(function (dbArticle) {
                    //         // View the added result in the console
                    //         console.log(dbArticle);
                    //     })
                    //     .catch(function (err) {
                    //         console.log(err);
                    //     });
                    // Send a message to the client
                    res.send("Scrape Complete");
                });
        };
    });

    // Route for getting all Articles from the the db
    app.get("/articles", function (req, res) {
        // Grab all documents from Articles collection
        db.Article.find({})
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

    app.post("/articles/:id", function (req, res) {
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

}