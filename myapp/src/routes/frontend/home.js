const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.article;
const subModel = containService.modelControl.category;
const emailModel = containService.modelControl.email;
const mainService = currentModel.articleService; // Service
const subService = subModel.categoryService;
const settingModel = containService.modelControl.setting;
const settingService = settingModel.settingService;

// Utility
const utilGetParam = require("../../utils/utilParam");

router.get("/", async (req, res, next) => {
  const itemSpecial = await mainService.getSpecial();
  const categoryParent = await subService.getAll({
    status: "active",
    ordering: { $lt: 4 },
  });
  const categoryArticle = await subService.getAll({
    status: "active",
    ordering: { $gt: 4 },
  });
  const setting = await settingService.getAll({});
  const contain = setting && setting.length > 0 ? setting[0].contain : "{}";
  const data = contain ? JSON.parse(contain) : {};
  res.render("frontend/pages/home/index", {
    title: "Homepage",
    itemSpecial,
    categoryParent,
    categoryArticle,
    data,
  });
});

router.get("/category/:category_id", async (req, res, next) => {
  const category_id = req.params.category_id;
  let condition = {};
  if (category_id !== "") {
    condition = {
      category: { $elemMatch: { $eq: category_id } },
      status: "active",
      special: "on",
    };
  }
  let item = await mainService.getAll(condition).limit(2);
  res.send(item);
});

router.post("/subscribe", async function (req, res) {
  const item = req.body;
  console.log(item);
  try {
    // Save the subscribed email to the database or perform any desired action
    const email = await emailModel.emailService.create(item);
    res.send(email);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).send("An error occurred while subscribing.");
  }
});

router.get("/category", async (req, res, next) => {
  let item = await mainService.getAll();
  const objString = JSON.stringify(item);
  const obj = JSON.parse(objString);
  res.send(objString);
});

module.exports = router;
