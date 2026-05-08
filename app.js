const path = require("path");
const express = require("express");
require("dotenv").config();

// **todo: authentication/session imports here

const app = express();
// **todo: route imports here

// Configure ejs for express
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Parses form data sent from the client into req.body
app.use(express.urlencoded({ extended: true }));

// **todo: session middleware here
// **todo: current user middleware

// **todo: route middleware
app.get("/", (req, res) => {
  res.send("Index page");
});

// todo: change to render later
// Route to catch all paths that don't exist
app.use("/{*splat}", (req, res) => {
  res.status(404).send("Error: change this to error res.render later");
});

// todo: change to render later
// Error handler middleware to catch errors throughout the app or from previous middleware function if using next(err)
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send("Error: change this to error res.render later");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server running on port: ${PORT}`);
});
