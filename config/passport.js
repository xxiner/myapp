//tools and shiet
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//require User Model
const User = require("../models/User");
module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: "login" }, (login, password, done) => {
      //match user
      let errors = [];
      User.findOne({ login: login })
        .then((user) => {
          // no match
          if (!user) {
            errors.push("cocl");
            return done(null, false);
          }
          //match
          bcrypt.compare(password, user.password, (err, ismatch) => {
            if (err) {
              throw err;
            }
            if (ismatch) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        })
        .catch((err) => console.log(err));
    })
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
