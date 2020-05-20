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

// GET - from album table
router.get("/api/album", function(req, res) {
  // get all restaurants (limited to first 10 here), return status code 200
  global.connection.query("SELECT * FROM DMDB_sp20.Album", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

// GET - from artist table
router.get("/api/artist", function(req, res) {
  // get all restaurants (limited to first 10 here), return status code 200
  global.connection.query("SELECT * FROM DMDB_sp20.artist", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

// GET - from contributor table
router.get("/api/contributor", function(req, res) {
  // get all restaurants (limited to first 10 here), return status code 200
  global.connection.query("SELECT * FROM DMDB_sp20.contributor", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

// GET - from review table
router.get("/api/review", function(req, res) {
  // get all restaurants (limited to first 10 here), return status code 200
  global.connection.query("SELECT * FROM DMDB_sp20.review", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

// GET - from soundtrack table
router.get("/api/soundtrack", function(req, res) {
  // get all restaurants (limited to first 10 here), return status code 200
  global.connection.query("SELECT * FROM DMDB_sp20.soundtrack", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

// PUT - UPDATE data in database, make sure to get the ID of the row to update from URL route, return status code 200 if successful
router.put("/api/restaurants/:id", function(req, res) {
  console.log(req.body);
  res.send(
    JSON.stringify({
      status: 200,
      error: null,
      response:
        "here on a put -- update restaurant with RestaurantID=" + req.params.id
    })
  );
});

// POST -- create new restaurant, return location of new restaurant in location header, return status code 200 if successful
router.post("/api/restaurants", function(req, res) {
  console.log(req.body);
  res.send(
    JSON.stringify({
      status: 201,
      error: null,
      Location: "/api/restaurants/id of new restaurant here",
      response:
        "here on a post -- create a new restaurant for " +
        req.body.RestaurantName +
        " in " +
        req.body.Boro
    })
  );
});

// DELETE -- delete restaurant with RestaurantID of :id, return status code 200 if successful
router.delete("/api/restaurants/:id", function(req, res) {
  res.send(
    JSON.stringify({
      status: 200,
      error: null,
      response:
        "here on a delete -- remove restaurant with RestaurantID=" +
        req.params.id
    })
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
