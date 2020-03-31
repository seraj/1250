var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var express = require("express");
var app = express();

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

app.get("/list", function(req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("db1250");
    dbo
      .collection("rank")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;
        db.close();
        res.send(
          result
            .map(item => ({ ...item, score: parseInt(item.score) }))
            .sort((a, b) => b.score - a.score)
        );
      });
  });
});

app.post("/add", function(req, res) {
  const params = req.body;
  console.log(params);
  const name = params["name"];
  const score = params["score"];
  if (name && score) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("db1250");
      dbo
        .collection("rank")
        .find({ name, score })
        .toArray(function(err, result) {
          if (err) throw err;
          if (!result.length) {
            var myobj = { name, score };
            dbo.collection("rank").insertOne(myobj, function(err, result) {
              if (err) throw err;
              console.log("rank inserted");
              db.close();
              res.send("Added!");
            });
          }
        });
    });
  } else {
    res.send("Not Added!");
  }
});

app.listen(3000);
