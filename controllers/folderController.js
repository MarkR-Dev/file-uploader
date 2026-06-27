const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma.js");

async function getNewFolder(req, res) {
  if (req.isAuthenticated()) {
    res.render("folder-new", {
      title: "File Uploader | New Folder",
      parentId: req.params.parentId,
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

        await prisma.folder.create({
          data: {
            name: validatedData.folder_name,
            userId: res.locals.currentUser.id,
            parentFolderId: req.params.parentId,
          },
        });

        res.redirect("/");
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  },
];

module.exports = { getNewFolder, postNewFolder };
