var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var path = require('path');
var http = require("request");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://localhost/MongoNews", { useNewUrlParser: true });

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/saved', function (req, res) {
  db.Saved.find({})
    .populate("note")
    .then(function (dbArticle) {
      res.render('saved', { saved: dbArticle });
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/scrape", function (req, res) {
  
  http("https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pEUVNnQVAB?hl=en-CA&gl=CA&ceid=CA%3Aen", function (error, response, body) {

    var $ = cheerio.load(body);
    db.Article.remove({}, function (err) {
      $("article").each(function (i, element) {
       
        var result = {};

        result.title = $(this)
          .find(".ipQwMb span")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        result.photo = $(this).parent("div")
          .find("figure img")
          .attr("src");

        db.Article.create(result)
          .then(function (dbArticle) {

          })
          .catch(function (err) {
            return res.json(err);
          });
      });
    });
    res.send("Scrape Complete");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/getsaved", function (req, res) {
  db.Saved.find({})
    .then(function (dbSaved) {
      console.log(dbSaved);
      res.json(dbSaved);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/tosave", function (req, res) {

  db.Saved.create(req.body.save)
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
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

app.post("/articles/:id", function (req, res) {

  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Saved.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function (dbSaved) {
      res.json(dbSaved);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
