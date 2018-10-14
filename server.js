var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var path = require('path');
var http = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/MongoNews", { useNewUrlParser: true });

// Routes
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/saved', function (req, res) {
  db.Saved.find({})
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render('saved', { saved: dbArticle });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  http("https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pEUVNnQVAB?hl=en-CA&gl=CA&ceid=CA%3Aen", function (error, response, body) {

    var $ = cheerio.load(body);
    db.Article.remove({}, function (err) {
      $("article").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .find(".ipQwMb span")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        result.photo = $(this).parent("div")
          .find("figure img")
          .attr("src");

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {

          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/getsaved", function (req, res) {
  // Grab every document in the Articles collection
  db.Saved.find({})
    .then(function (dbSaved) {
      console.log(dbSaved);
      res.json(dbSaved);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/tosave", function (req, res) {

  db.Saved.create(req.body.save)
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
app.post("/delete/", function (req, res) {

  db.Saved.findOneAndDelete({ _id: req.body.id }, function (err) {
    if (!err) res.end();
  }).catch(function (err) {
    res.json(err);
  })
});
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {

  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Saved.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id }}, { new: true });
    })
    .then(function (dbSaved) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbSaved);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
