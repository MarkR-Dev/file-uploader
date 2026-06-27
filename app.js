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
const indexRouter = require("./routes/indexRouter.js");
const accountRouter = require("./routes/accountRouter.js");
const folderRouter = require("./routes/folderRouter.js");

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

app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use("/folder", folderRouter);

// Route to catch all paths that don't exist
app.use("/{*splat}", (req, res) => {
  res
    .status(404)
    .render("error", { title: "File Uploader | Error", statusCode: 404 });
});

// Error handler middleware to catch errors throughout the app or from previous middleware function if using next(err)
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).render("error", {
    title: "File Uploader | Error",
    statusCode: statusCode,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server running on port: ${PORT}`);
});
