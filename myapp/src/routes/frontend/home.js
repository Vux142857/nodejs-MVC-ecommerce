const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.article;
const subModel = containService.modelControl.category;
const emailModel = containService.modelControl.email;
const mainService = currentModel.articleService; // Service
const subService = subModel.categoryService;

// Utility
const utilGetParam = require("../../utils/utilParam");

router.get("/", async (req, res, next) => {
  const itemSpecial = await mainService.getSpecial();
  const category = await subService.getAll();
  res.render("frontend/pages/home/index", {
    title: "Homepage",
    itemSpecial,
    category,
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

module.exports = router;
