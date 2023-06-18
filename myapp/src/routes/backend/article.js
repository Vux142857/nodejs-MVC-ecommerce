const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.category;
const articleService = currentModel.articleService; // Service

router.post("/add", async (req, res, next) => {
  try {
    let item = req.body;
    let data = await articleService.create(item);
    res.send(data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.get("/(/:limit)?(/:next)?", async (req, res, next) => {
  try {
    let limit = parseInt(req.query.limit);
    let next = parseInt(req.query.next);
    let data= await articleService.getAll().limit(limit).skip(next);
    res.send(data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

module.exports = router;
