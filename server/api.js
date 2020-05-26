/* 	Node API demo
	Author: Tim Pierson, Dartmouth CS61, Spring 2020

	Add config.js file to root directory
	To run: nodemon api.js <local|sunapee>
	App will use the database credentials and port stored in config.js for local or sunapee server
	Recommend Postman app for testing verbs other than GET, find Postman at https://www.postman.com/
*/

var express = require("express");
let mysql = require("mysql");
const bodyParser = require("body-parser"); //allows us to get passed in api calls easily
var app = express();

// get config
var env = process.argv[2] || "local"; //use localhost if enviroment not specified
var config = require("./config")[env]; //read credentials from config.js

//Database connection
app.use(function(req, res, next) {
  global.connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.schema
  });
  connection.connect();
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up router
var router = express.Router();

// log request types to server console
router.use(function(req, res, next) {
  console.log("/" + req.method);
  next();
});

// set up routing
// calls should be made to /api/restaurants with GET/PUT/POST/DELETE verbs
// you can test GETs with a browser using URL http://localhost:3000/api/restaurants or http://localhost:3000/api/restaurants/30075445
// recommend Postman app for testing other verbs, find it at https://www.postman.com/
router.get("/", function(req, res) {
  res.send("Yo!  This my API.  Call it right, or don't call it at all!");
});

// GET all artists
router.get("/api/artist", function(req, res) {
  global.connection.query("SELECT * FROM DMDB_sp20.Artist", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

// GET album for a artist
router.get("/api/artist/:id/album", function(req, res) {
  global.connection.query(
    `SELECT Album.AlbumID,Album.AlbumName,Album.DateReleased FROM Artist JOIN Contributor ON Artist.ArtistID=Contributor.ArtistID
    JOIN Album ON Contributor.AlbumID=Album.AlbumID
    WHERE Artist.ArtistID = ?`,
    [req.params.id],
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

// PUT Artist
router.put("/api/artist/:id", function(req, res) {
  console.log(req.body);
  global.connection.query(
    "UPDATE Artist SET ? WHERE ArtistID=?",
    [req.body, req.params.id],
    function(error, results, fields) {
      if (error) throw error;
      res.send(req.body);
    }
  );
});

// POST Artist
router.post("/api/artist", function(req, res) {
  global.connection.query("INSERT INTO Artist SET ?", req.body, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    const newArtist = Object.assign(
      {},
      { ArtistID: results["insertId"] },
      req.body
    );
    res.send(JSON.stringify(newArtist));
  });
});

// DELETE Artist
router.delete("/api/artist/:id", function(req, res) {
  global.connection.query(
    "DELETE FROM Artist WHERE ArtistID = ?",
    [req.params.id],
    function(error, results, fields) {
      if (error) throw error;
      res.send(
        JSON.stringify({ status: 200, error: null, response: "success" })
      );
    }
  );
});

// start server running on port 3000 (or whatever is set in env)
app.use(express.static(__dirname + "/"));
app.use("/", router);
app.set("port", process.env.PORT || config.port || 3000);

app.listen(app.get("port"), function() {
  console.log("Node server is running on port " + app.get("port"));
  console.log("Environment is " + env);
});