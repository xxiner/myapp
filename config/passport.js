//tools and shiet
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//require User Model
const User = require("../models/User");
module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { passReqToCallback: true, usernameField: "login" },
      function (req, login, password, done) {
        //match user
        User.findOne({ login: login })
          .then((user) => {
            // no match
            if (!user) {
              return done(
                null,
                false,
                req.flash("success_msg", "No such user")
              );
            }
            //match
            bcrypt.compare(password, user.password, (err, ismatch) => {
              if (err) {
                throw err;
              }
              if (ismatch) {
                return done(null, user);
              } else {
                return done(
                  null,
                  false,
                  req.flash("success_msg", "Invalid login or password")
                );
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
