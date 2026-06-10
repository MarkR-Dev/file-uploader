const { Router } = require("express");
const {
  getHomepage,
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
} = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", getHomepage);

indexRouter.get("/sign-up", getSignUp);
indexRouter.post("/sign-up", postSignUp);

indexRouter.get("/login", getLogin);
indexRouter.post("/login", postLogin);

module.exports = indexRouter;
