const passport = require("passport");
const Staff = require("../model/staff.js");
const Admin = require("../model/admin.js");
const localStrategy = require("passport-local").Strategy;
const argon = require("argon2");

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const itsAdmin = await Admin.findById(id);
  const itsStaff = await Staff.findById(id);
  if (itsAdmin) {
    return done(null, itsAdmin);
  }
  if (itsStaff) {
    return done(null, itsStaff);
  }
  let msg = " not found";
  return done(msg);
});

passport.use(
  "admin.login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      let errMsg = [];
      let successMsg = [];
      try {
        const foundAdmin = await Admin.findOne({ email });
        if (!foundAdmin) {
          let message = "no admin found with this email";
          errMsg.push(message);
          return done(null, false, req.flash("error", errMsg));
        }
        let isPasswordCorrect = await argon.verify(
          foundAdmin.password,
          password
        );

        if (!isPasswordCorrect) {
          let message = "incorrect password";
          errMsg.push(message);
          return done(null, false, req.flash("error", errMsg));
        }
        return done(null, foundAdmin);
      } catch (err) {
        errMsg.push(err.message);
        return done(null, false, req.flash("error", errMsg));
      }
    }
  )
);

passport.use(
  "staff.login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      let errMsg = [];
      try {
        const foundStaff = await Staff.findOne({ email });
        if (!foundStaff) {
          let message = "no staff found with this email";
          errMsg.push(message);
          return done(null, false, req.flash("error", errMsg));
        }
        let isPasswordCorrect = await argon.verify(
          foundStaff.password,
          password
        );

        if (!isPasswordCorrect) {
          let message = "incorrect password";
          errMsg.push(message);
          return done(null, false, req.flash("error", errMsg));
        }
        return done(null, foundStaff);
      } catch (err) {
        return done(err.message);
      }
    }
  )
);
