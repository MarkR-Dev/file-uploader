const { Router } = require("express");
const {
  getAccount,
  postLogout,
  postDelete,
} = require("../controllers/accountController");

const accountRouter = Router();

accountRouter.get("/", getAccount);

accountRouter.post("/logout", postLogout);

accountRouter.post("/delete", postDelete);

module.exports = accountRouter;
