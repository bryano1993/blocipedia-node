const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const publishableKey = process.env.PUBLISHABLE_KEY;

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },

  create(req, res, next) {
    console.log("create a user");
    console.log(JSON.stringify(req.body));
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.password_conf
    };

    console.log(JSON.stringify(newUser));
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function() {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  upgradeForm(req, res, next) {
    res.render("users/upgrade", { publishableKey });
  },

  upgrade(req, res, next) {
    userQueries.upgrade(req.user.dataValues.id);
    res.render("users/paymentNotification");
  },

  downgrade(req, res, next) {
    userQueries.downgrade(req.user.dataValues.id);
    req.flash("notice", "Sorry, you are no longer a premium user!");
    res.redirect("/");
  }
};
