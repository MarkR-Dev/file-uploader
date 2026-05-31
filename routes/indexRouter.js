const { Router } = require("express");
const { getHomepage, getSignup } = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", getHomepage);

indexRouter.get("/sign-up", getSignup);

module.exports = indexRouter;
