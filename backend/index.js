const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

require("dotenv").config();

const User = require("./models/user");
const Puzzle = require("./models/puzzle");

const app = express();

const urlencodedParser = bodyParser.urlencoded({ extendeded: false });
app.use(bodyParser.json(), urlencodedParser);
app.use(cors());

const dbURI = process.env.ATLAS_URI;
const PORT = process.env.PORT || 5001;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(PORT, () => {
      console.log("Server started...");
    });
  })
  .catch((err) => console.log(err));


// Registers user to database
app.post("/register", async (req, res) => {
  const user = req.body;

  const takenUsername = await User.findOne({
    username: user.username.toLowerCase(),
  });

  if (takenUsername) {
    res.json({ message: "Username already taken" });
  } else {
    user.password = await bcrypt.hash(req.body.password, 10);

    const dbUser = new User({
      username: user.username.toLowerCase(),
      password: user.password,
    });

    dbUser.save();
    res.json({ message: "Success" });
  }
});

// Logs in user and return JWT token
app.post("/login", (req, res) => {
  const userLoggingIn = req.body;

  User.findOne({ username: userLoggingIn.username }).then((dbUser) => {
    if (!dbUser) {
      return res.json({
        message: "Invalid username or password",
      });
    }

    bcrypt
      .compare(userLoggingIn.password, dbUser.password)
      .then((isCorrect) => {
        if (isCorrect) {
          const payload = {
            id: dbUser._id,
            username: dbUser.username,
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 86400 },
            (err, token) => {
              if (err) return res.json({ message: err });
              return res.json({
                message: "Success",
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.json({
            message: "Invalid username or Password",
          });
        }
      });
  });
});

// Verifies if token is correct
function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"]?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.json({
          isLoggedIn: false,
          message: "Failed To Authenticate",
        });
      req.user = {};
      req.user.id = decoded.id;
      req.user.username = decoded.username;
      next();
    });
  } else {
    res.json({ message: "Incorrect Token Given", isLoggedIn: false });
  }
}

// Returns leaderboards data
app.get("/leaderboards", async (req, res) => {
  const puzzle = req.query.puzzle;

  try {
    // Find the top 5 data from the collection based on the score parameter
    const Scores = await User.find()
      .sort({ Score: -1 })
      .limit(5)
      .select("username Score");

    // Find the top 5 data from the collection based on the Games parameter
    const Games = await User.find()
      .sort({ Games: -1 })
      .limit(5)
      .select("username Games");

    // Find the top 5 data from the collection based on the Time parameter
    const Times = await Puzzle.find({ puzzle: puzzle })
      .sort({ Time: 1 })
      .limit(5)
      .select("username Time");

    // Send the data as the response to the client
    res.status(200).json({
      message: "Success",
      Scores: Scores,
      Games: Games,
      Time: Times,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Adds solution of user to database
app.post("/solution", verifyJWT, async (req, res) => {
  try {
    const username = req.user.username;
    const { puzzle, points, time } = req.body;

    // Find user by username and update score
    const user = await User.findOneAndUpdate(
      { username },
      { $inc: { Score: points, Games: 1 } },
      { new: true }
    );

    // Create new puzzle document
    const newPuzzle = new Puzzle({
      puzzle: puzzle,
      username: username,
      Time: time,
    });
    await newPuzzle.save();

    res.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Returns details of loggedin user
app.get("/getDetails", verifyJWT, async (req, res) => {
  const username = req.user.username;

  // Find the user with the specified username
  User.findOne({ username: username })
    .then((user) => {
        // If no user was found, return a 404 response
        if (!user) {
            res.status(404).json({ message: `User '${username}' not found` });
            return;
        }

        // If a user was found, return their details
        res.json({
            username: user.username,
            Games: user.Games,
            Score: user.Score,
        });
    })
    .catch((error) => {
        // If an error occurred while retrieving the user, return a 500 response
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    });
});
