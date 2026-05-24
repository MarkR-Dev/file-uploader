const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.render("index", { title: "File Uploader | Home" });
});

module.exports = indexRouter;

//TODO: make the error ejs after deciding the colours and styles
//TODO: reread plans
