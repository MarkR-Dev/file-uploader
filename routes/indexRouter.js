const { Router } = require("express");
const {
  getHomepage,
  getSignUp,
  postSignUp,
} = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", getHomepage);

indexRouter.get("/sign-up", getSignUp);
indexRouter.post("/sign-up", postSignUp);

module.exports = indexRouter;
