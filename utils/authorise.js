const { prisma } = require("../lib/prisma.js");

async function checkAuthorisation(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.params.id) {
      const folder = await prisma.folder.findUnique({
        where: { id: +req.params.id },
      });

      if (!folder) {
        next(new Error("File not found"));
        return;
      }

      if (folder.userId !== res.locals.currentUser.id) {
        next(new Error("User is not authorised perform that action"));
        return;
      }
    }
    next();
  } else {
    res.redirect("/");
  }
}

module.exports = { checkAuthorisation };
