const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma.js");

async function getNewFolder(req, res) {
  if (req.isAuthenticated()) {
    res.render("folder-new", {
      title: "File Uploader | New Folder",
      parentId: req.params.id,
    });
  } else {
    res.redirect("/");
  }
}

const validateFolder = [
  body("folder_name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required.")
    .isLength({ min: 1, max: 50 })
    .withMessage("Folder name must be between 1-50 characters."),
];

const postNewFolder = [
  validateFolder,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const prevData = matchedData(req, { onlyValidData: false });
      return res.status(400).render("folder-new", {
        title: "File Uploader | New Folder",
        errors: errors.array(),
        prevName: prevData.folder_name,
      });
    } else {
      try {
        const validatedData = matchedData(req);

        const newFolder = await prisma.folder.create({
          data: {
            name: validatedData.folder_name,
            userId: res.locals.currentUser.id,
            parentFolderId: +req.params.id,
          },
        });

        res.redirect(`/folder/${newFolder.id}`);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  },
];

async function getEditFolder(req, res) {
  if (req.isAuthenticated()) {
    const folderId = +req.params.id;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    res.render("folder-edit", {
      title: "File Uploader | Edit Folder",
      folder: folder,
    });
  } else {
    res.redirect("/");
  }
}

const validateEditFolder = [
  body("edit_folder_name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required.")
    .isLength({ min: 1, max: 50 })
    .withMessage("Folder name must be between 1-50 characters."),
];

const postEditFolder = [
  validateEditFolder,
  async (req, res) => {
    const errors = validationResult(req);

    const folderId = +req.params.id;

    if (!errors.isEmpty()) {
      const prevData = matchedData(req, { onlyValidData: false });

      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
      });

      return res.status(400).render("folder-edit", {
        title: "File Uploader | Edit Folder",
        errors: errors.array(),
        folder: folder,
        prevEditName: prevData.edit_folder_name,
      });
    } else {
      try {
        const validatedData = matchedData(req);

        await prisma.folder.update({
          where: { id: folderId },
          data: { name: validatedData.edit_folder_name },
        });

        res.redirect(`/folder/${folderId}`);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  },
];

async function getSelectedFolder(req, res, next) {
  if (req.isAuthenticated()) {
    const folderId = +req.params.id;

    const selectedFolder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        childFolders: { orderBy: { name: "asc" } },
        files: { orderBy: { name: "asc" } },
      },
    });

    res.render("folder-selected", {
      title: `File Uploader | ${selectedFolder.name}`,
      selectedFolder: selectedFolder,
    });
  } else {
    res.redirect("/");
  }
}

module.exports = {
  getNewFolder,
  postNewFolder,
  getEditFolder,
  postEditFolder,
  getSelectedFolder,
};
