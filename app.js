const path = require("path");
const express = require("express");
require("dotenv").config();

// Authentication/session imports
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./lib/prisma.js");
const passport = require("passport");
require("./config/passportConfig.js");

const app = express();
// **todo: route imports here

// Configure ejs for express
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Parses form data sent from the client into req.body
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.session());

// Middleware to set the currently logged in user to res.locals to avoid having to pass the user into every controller/route/view
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// **todo: route middleware
app.get("/", (req, res) => {
  res.send("Index page");
});

// todo: change to error render later
// Route to catch all paths that don't exist
app.use("/{*splat}", (req, res) => {
  res.status(404).send("Error: change this to error res.render later");
});

// todo: change to error render later
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
