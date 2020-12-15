const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { hash } = require("bcrypt-nodejs");
const router = express.Router();
const passport = require("passport");
//regular expresions for user registration
const loginPattern = new RegExp(/^[a-z0-9_-]{5,16}$/);
const passwordPattern = new RegExp(/^[a-z0-9_-]{5,16}$/);

//login page
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

//register page
router.get("/register", (req, res) => {
  res.render("register.ejs");
});

//register handle
router.post("/register", (req, res) => {
  const { login, password, repassword } = req.body;
  let errors = [];
  if (!loginPattern.test(login)) {
    errors.push("Ошибка ввода логина");
  }
  if (!passwordPattern.test(password) || password != repassword) {
    errors.push("Ошибка ввода пароля");
  }
  if (errors.length == 0) {
    //validation pass
    User.findOne({ login: login }).then((user) => {
      if (user) {
        //user already exists
        errors.push("nickname already exists");
        res.render("register", {
          //input errors
          login,
          password,
          repassword,
          errors,
        });
      } else {
        //user registration part
        //user formation and registration
        const newUser = new User({
          login,
          password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then((user) => {
              console.log("added user " + newUser);
              req.flash("success_msg", "You are now registered and can login");
              res.redirect("/users/login");
            });
          });
        });
      }
    });
  } else {
    res.render("register", {
      //input errors
      login,
      password,
      repassword,
      errors,
    });
  }
});
//login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })(req, res, next);
});

module.exports = router;
