const { Router } = require("express");
const {
  getNewFolder,
  postNewFolder,
  getEditFolder,
  postEditFolder,
  getSelectedFolder,
} = require("../controllers/folderController");

const { checkAuthorisation } = require("../utils/authorise");

const folderRouter = Router();

// Allows creation of home folders in index page or nested folders via optional params
folderRouter.get("/{:id/}new", checkAuthorisation, getNewFolder);
folderRouter.post("/{:id/}new", checkAuthorisation, postNewFolder);

folderRouter.get("/:id", checkAuthorisation, getSelectedFolder);

folderRouter.get("/:id/edit", checkAuthorisation, getEditFolder);
folderRouter.post("/:id/edit", checkAuthorisation, postEditFolder);

folderRouter.post("/:id/delete", (req, res) => {
  res.send(
    `folder delete: ${req.params.id}, finish later when rest of functionality is done`,
  );
});

module.exports = folderRouter;
