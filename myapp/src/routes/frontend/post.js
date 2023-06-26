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

router.get("/:article_id", async (req, res, next) => {
  const article_id = req.params.article_id;
  const item = await mainService.getOne({ _id: article_id });
  // const category = await subService.getAll();
  console.log(item);
  
  res.render("frontend/pages/post/index", {
    item
  });
  // res.send(item);
});

module.exports = router;
