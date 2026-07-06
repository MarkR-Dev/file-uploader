const { Router } = require("express");
const {
  getNewFolder,
  postNewFolder,
  getEditFolder,
  postEditFolder,
  getSelectedFolder,
} = require("../controllers/folderController");

const folderRouter = Router();

// allows creation of home folders in index page or nested folders via optional params
folderRouter.get("/{:parentId/}new", getNewFolder);
folderRouter.post("/{:parentId/}new", postNewFolder);

folderRouter.get("/:id", getSelectedFolder);

folderRouter.get("/:id/edit", getEditFolder);
folderRouter.post("/:id/edit", postEditFolder);

folderRouter.post("/:id/delete", (req, res) => {
  res.send(
    `folder delete: ${req.params.id}, finish later when rest of functionality is done`,
  );
});

module.exports = folderRouter;
