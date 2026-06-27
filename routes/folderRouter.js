const { Router } = require("express");
const {
  getNewFolder,
  postNewFolder,
} = require("../controllers/folderController");

const folderRouter = Router();

folderRouter.get("/{:parentId/}new", getNewFolder);

folderRouter.post("/{:parentId/}new", postNewFolder);

module.exports = folderRouter;
