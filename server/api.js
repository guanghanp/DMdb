/* 	Node API demo
	Author: Tim Pierson, Dartmouth CS61, Spring 2020

	Add config.js file to root directory
	To run: nodemon api.js <local|sunapee>
	App will use the database credentials and port stored in config.js for local or sunapee server
	Recommend Postman app for testing verbs other than GET, find Postman at https://www.postman.com/
*/

require("dotenv").config();
var express = require("express");
let mysql = require("mysql");
const bodyParser = require("body-parser"); //allows us to get passed in api calls easily
var app = express();
const session = require("express-session");
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// set up router
var router = express.Router();

// log request types to server console
router.use(function(req, res, next) {
  console.log("/" + req.method);
  next();
});

const authenticationMiddleware = (request, response, next) => {
  if (request.user.Admin === 1) {
    return next(); // we are good, proceed to the next handler
  }
  return response.sendStatus(403); // forbidden
};

const isAdmin = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next(); // we are good, proceed to the next handler
  }
  return response.sendStatus(403); // forbidden
};

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

// GET Soundtracks for a artist
router.get("/api/artist/:id/soundtrack", function(req, res) {
  global.connection.query(
    `SELECT Album.AlbumID,Album.AlbumName,Album.DateReleased,
    Soundtrack.SoundtrackID,Soundtrack.SoundtrackName,Genre.GenreName
    FROM Artist 
    JOIN Contributor ON Artist.ArtistID=Contributor.ArtistID
    JOIN Album ON Contributor.AlbumID=Album.AlbumID
    LEFT JOIN Soundtrack ON Album.AlbumID=Soundtrack.AlbumID
    LEFT JOIN Genre ON Soundtrack.AlbumID=Genre.GenreID
    WHERE Artist.ArtistID=?;`,
    [req.params.id],
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

// GET reviews for a soundtrack
router.get("/api/soundtrack/:id/review", function(req, res) {
  global.connection.query(
    `SELECT Review.Rating,Review.Review,Review.Likes,User.Username, Review.TimeCreated
    FROM Soundtrack 
    JOIN Review ON Soundtrack.SoundtrackID=Review.SoundtrackID
    JOIN User ON Review.UserID=User.UserID
    WHERE Soundtrack.SoundtrackID=?;`,
    [req.params.id],
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

// PUT Artist
router.put("/api/artist/:id", authenticationMiddleware, isAdmin, function(
  req,
  res
) {
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
router.post("/api/artist", authenticationMiddleware, isAdmin, function(
  req,
  res
) {
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

// POST Review
router.post("/api/review", authenticationMiddleware, function(req, res) {
  global.connection.query("INSERT INTO Review SET ?", req.body, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify(req.body));
  });
});

// DELETE Artist
router.delete("/api/artist/:id", authenticationMiddleware, isAdmin, function(
  req,
  res
) {
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

passport.use(
  new BearerStrategy((token, done) => {
    googleClient
      .verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      .then(async ticket => {
        var user = undefined;
        const payload = ticket.getPayload();
        global.connection.query(
          "SELECT * FROM DMDB_sp20.User WHERE GoogleID = ?",
          payload.sub,
          function(error, results, fields) {
            if (error) throw error;
            if (results.length < 1) {
              user = {
                GoogleID: payload.sub,
                Username: payload.name,
                Admin: 0
              };
              global.connection.query(
                "INSERT INTO DMDB_sp20.User SET ?",
                user,
                function(error, results, fields) {
                  if (error) throw error;
                  const newUser = Object.assign(
                    {},
                    { UserID: results["insertId"] },
                    user
                  );
                  console.log("new user created:");
                  console.log(newUser);

                  done(null, newUser);
                }
              );
            } else {
              console.log("Welcome back:");
              console.log(results[0]);
              done(null, results[0]);
            }
          }
        );
      })
      .catch(error => {
        done(error);
      });
  })
);

app.post(
  "/login",
  passport.authenticate("bearer", { session: true }),
  (request, response, next) => {
    response.send(JSON.stringify(request.user));
  }
);

passport.serializeUser((user, done) => {
  done(null, user.UserID);
});

passport.deserializeUser((id, done) => {
  global.connection.query(
    "SELECT * FROM DMDB_sp20.User WHERE UserID = ?",
    id,
    function(error, results, fields) {
      if (error) throw error;
      const user = results[0];
      done(null, user);
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
