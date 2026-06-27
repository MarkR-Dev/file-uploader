const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");

async function getHomepage(req, res) {
  let homeFolders = [];

  if (req.isAuthenticated()) {
    homeFolders = await prisma.folder.findMany({
      where: {
        AND: { userId: res.locals.currentUser.id, parentFolderId: null },
      },
      orderBy: { name: "asc" },
    });
  }

  res.render("index", { title: "File Uploader | Home", folders: homeFolders });
}

async function getSignUp(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("sign-up", { title: "File Uploader | Sign Up" });
  }
}

const validateSignUp = [
  body("username_sign_up")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 5, max: 20 })
    .withMessage("Username length must be between 5-20 characters.")
    .custom(async (usernameValue) => {
      // Custom validator to check for username already in use
      const user = await prisma.user.findUnique({
        where: { username: usernameValue },
      });

      // If the query finds a user that means the username is taken
      if (user) {
        throw new Error("Username is already in use.");
      }
    }),
  body("email_sign_up")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isLength({ min: 5, max: 50 })
    .withMessage("Email length must be between 5-50 characters.")
    .isEmail()
    .withMessage("Email format is invalid.")
    .custom(async (emailValue) => {
      // Custom validator to check for email already in use
      const user = await prisma.user.findUnique({
        where: { email: emailValue },
      });

      // If the query finds a user that means the email is taken
      if (user) {
        throw new Error("Email is already in use.");
      }
    }),
  body("password_sign_up")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8-20 characters."),
  body("confirm_password_sign_up")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required.")
    .isLength({ min: 8, max: 20 })
    .withMessage("Confirm password must be between 8-20 characters.")
    .custom((confirmValue, { req }) => {
      // Custom validator to check that password and confirm password input fields match
      if (confirmValue !== req.body.password_sign_up) {
        throw new Error("Password and Confirm Password do not match.");
      } else {
        return true;
      }
    }),
];

const postSignUp = [
  validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const prevData = matchedData(req, { onlyValidData: false });

      return res.status(400).render("sign-up", {
        title: "File Uploader | Sign Up",
        errors: errors.array(),
        prevUsername: prevData.username_sign_up,
        prevEmail: prevData.email_sign_up,
        prevPassword: prevData.password_sign_up,
        prevConfirmPassword: prevData.confirm_password_sign_up,
      });
    } else {
      try {
        const validatedData = matchedData(req);

        // Hash user entered password with a salt of 10 before storing password in DB
        validatedData.password_sign_up = await bcrypt.hash(
          validatedData.password_sign_up,
          10,
        );

        await prisma.user.create({
          data: {
            username: validatedData.username_sign_up,
            email: validatedData.email_sign_up,
            password: validatedData.password_sign_up,
          },
        });

        res.redirect("/login");
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  },
];

async function getLogin(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("login", {
      title: "File Uploader | Login",
      loginErrors: req.session.messages,
    });

    if (req.session.messages) {
      req.session.messages = [];
    }
  }
}

const validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 5, max: 20 })
    .withMessage("Username length must be between 5-20 characters."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8-20 characters."),
];

const postLogin = [
  validateLogin,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const prevData = matchedData(req, { onlyValidData: false });

      return res.status(400).render("login", {
        title: "File Uploader | Login",
        errors: errors.array(),
        prevUsername: prevData.username,
        prevPassword: prevData.password,
      });
    } else {
      next();
    }
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
];

module.exports = { getHomepage, getSignUp, postSignUp, getLogin, postLogin };
