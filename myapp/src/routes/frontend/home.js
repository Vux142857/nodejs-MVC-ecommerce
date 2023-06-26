const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.article;
const subModel = containService.modelControl.category;
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

module.exports = router;
