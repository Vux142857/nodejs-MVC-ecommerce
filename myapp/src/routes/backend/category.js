const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.category;
const subModel = containService.modelControl.article;
const currentService = currentModel.categoryService;
const subService = subModel.articleService;

router.post("/add", async (req, res, next) => {
  try {
    let item = req.body;
    let data = await currentService.create(item);
    res.send(data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Need adjust
router.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = await subService.getOne(id);
    res.send(data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let data = await currentService.getAll();
    res.send(data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

module.exports = router;
