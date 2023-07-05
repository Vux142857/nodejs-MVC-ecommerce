const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// // Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.user;
const mainService = currentModel.userService; // Service
const userModel = require("../../models/userModel");


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
    const item = req.body;
    console.log(item);
    
    let itemExisted= userModel.findOne({username: item.username});
    console.log(itemExisted);
    
    let validate = await bcrypt.compare(item.password, itemExisted.password);
    // let newPass01 = await bcrypt
    //   .hash(item.password, saltRounds)
    //   .then((hash) => {
    //     console.log(hash);
    //   })
    //   .catch((err) => console.error(err.message));

    // let data = {
    //   username: item.username,
    //   password: await bcrypt.hash(item.password, saltRounds),
    // };
    let data = (validate) ? itemExisted: {};

    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const item = req.body;

    // let data = {
    //   username: item.username,
    //   email: item.email,
    //   password: await bcrypt.hash(item.password, saltRounds),
    // };

    let data = await mainService.create(item);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
