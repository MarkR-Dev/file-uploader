async function getAccount(req, res) {
  if (req.isAuthenticated()) {
    res.render("account", { title: "File Uploader | Account" });
  } else {
    res.redirect("/");
  }
}

async function postLogout(req, res) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function postDelete(req, res) {
  // TODO: finish later
  res.send(
    "Delete account POST - finish later when file stuff is done as you'll need to remove the files from the external storage, db should cascade on a deleted user, logout the user first?",
  );
}

module.exports = { getAccount, postLogout, postDelete };
