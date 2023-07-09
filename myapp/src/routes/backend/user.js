const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// // Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.user;
const mainService = currentModel.userService; // Service
const User = require("../../models/userModel");
const auth = require("../../validates/jwt");
const jwt = require("jsonwebtoken");

// // Utility
// const utilGetParam = require("../../utils/utilParam");
// const validateItems = require("../../validates/article");
// const utilUpload = require("../../utils/utilUpload.js");
// const uploadFileMiddleware = utilUpload.upload("logo", "logo");

// ---------------------------------------------------------------GET

// Get form edit or add
// router.get("/", async (req, res, next) => {
//   const title = currentModel.name;
//   const item = await mainService.getAll({});
//   const contain = item && item.length > 0 ? item[0].contain : "{}";
//   const data = contain ? JSON.parse(contain) : {};
//   const errorsNotify = [];

//   res.render(`backend/pages/${currentModel.save}`, {
//     title,
//     errorsNotify,
//     collection: currentModel.name,
//     item,
//     data,
//   });
// });

router.post("/login", async (req, res, next) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    console.log(user);

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      console.log(123);

      // const token = jwt.sign({ _id: user._id, email }, "sdasds", {
      //   expiresIn: "2h",
      // });

      // // save user token
      // user.token = token;

      // user
      res.status(201).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", auth, async (req, res, next) => {
  // Our register logic starts here
  try {
    // Get user input
    const { username, email, password } = req.body;

    // Validate user input
    if (!(email && password && username)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    // //Encrypt user password
    // encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      username,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password,
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, "sdasds", {
      expiresIn: "2h",
    });

    // Save user token
    user.token = token;

    // return new user
    // res.status(201).json(user);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
