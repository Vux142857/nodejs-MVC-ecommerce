require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
// const logger = require("morgan");
// const fs = require("fs");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
var flash = require("connect-flash");
const app = express();
const recordError = require("./src/utils/utilRecordError");

// Session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 600 * 6000,
    },
  })
);

// Flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = req.flash();
  next();
});

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(expressLayouts);
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connection successfully!"));

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./src/routes"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  recordError(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "Error" });
});

module.exports = app;
