const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.article;
const subModel = containService.modelControl.category;
const mainService = currentModel.articleService; // Service
const subService = subModel.categoryService;

// Utility
const utilStatusFilter = require("../../utils/utilCreateStatus");
const utilGetParam = require("../../utils/utilParam");
const validateItems = require("../../validates/article");
const utilUpload = require("../../utils/utilUpload.js");
const uploadFileMiddleware = utilUpload.upload("thumb", "article");

router.get("/", async (req, res, next) => {
  const itemSpecial = await mainService.getSpecial();
  res.render("frontend/pages/home/index", {
    title: "Homepage",
    itemSpecial,
  });
});

module.exports = router;
