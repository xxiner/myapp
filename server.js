//tools
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

//passport config
require("./config/passport")(passport);

//DB config
const db = process.env.DATABASE_URL;

//DB connect
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

//DB users Chema
const user = require("./models/User");
const { connect } = require("./router");

//bodyparser
app.use(express.urlencoded({ extended: false }));

//session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
//passport
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//global const
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//Routes
app.use("/", require("./router/index"));
app.use("/users", require("./router/users"));

//EJS
app.set("view engine", "ejs");

//app start
const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log("server started at port " + PORT));
