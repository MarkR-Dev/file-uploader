async function getHomepage(req, res) {
  // TODO: change this later when user login is done to send their initial folders into the index, send in empty data if not signed in?
  res.render("index", { title: "File Uploader | Home" });
}

async function getSignup(req, res) {
  // TODO: stop users who are already signed in from signing up
  res.render("sign-up", { title: "File Uploader | Sign Up" });
}

module.exports = { getHomepage, getSignup };

/*
TODO:
errors partial and css
sign up inputs values set to locals.prevName on validation failure redirect
custom username validation for dupes, custom email validation for dupes, custom confirm password for exact match
custom email validation? read docs to see what they offer
*/
