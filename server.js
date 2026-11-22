// server.js - the main file. We start the website from here.

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Connect to the MongoDB database
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/quicksell";

mongoose
  .connect(MONGO_URL)
  .then(function () {
    console.log("MongoDB connected");
  })
  .catch(function (err) {
    console.log("MongoDB connection failed: " + err.message);
  });

// 2. Tell Express to use EJS for the pages (views folder)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 3. Read form data and serve files from the public folder (css, js, images, uploads)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// 4. Session = remembers who is logged in
app.use(
  session({
    secret: process.env.SESSION_SECRET || "quicksell-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// 5. Values that every page can use
app.locals.categories = ["Paper", "Plastic", "Metal", "Electronic", "Furniture", "Other"];

app.use(function (req, res, next) {
  res.locals.user = req.session.user || null;       // logged in seller (or null)
  res.locals.message = req.session.message || null; // one-time green message
  res.locals.error = null;                          // red error message
  delete req.session.message;                       // show the message only once
  next();
});

// 6. Routes (the pages)
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/products"));

// 7. If something goes wrong (for example a very big image), show a simple message
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send("Something went wrong: " + err.message + ' <a href="/">Go Home</a>');
});

// 8. Start the server
app.listen(PORT, function () {
  console.log("QuickSell is running at http://localhost:" + PORT);
});
