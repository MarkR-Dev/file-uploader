const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });

      // Username doesn't exist
      if (!user) {
        return done(null, false, {
          message: "An account with that username doesn't exist.",
        });
      }

      const match = await bcrypt.compare(password, user.password);
      // Passwords do not match!
      if (!match) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});
