const express = require("express");
const router = express.Router();
const itemService = require("../../services/vdService");

router.post("/123", async (req, res, next) => {
  try {
    let item = req.body;
    let data = await itemService.create(item);
    res.send(data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    res.send(id);
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.get("/:num1/:num2?", async (req, res, next) => {
  try {
    let num1 = parseInt(req.params.num1) - 1;
    let num2 = parseInt(req.params.num2) - 1;
    let data = await itemService.getAll();
    let first = data[num1];
    let second = data[num2];
    res.send({ first, second });
  } catch (error) {
    console.log("Error: ", error);
  }
});

module.exports = router;
