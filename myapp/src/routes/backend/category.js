const express = require("express");
const router = express.Router();
const itemService = require("../../services/categoryService");

router.post("/add", async (req, res, next) => {
  try {
    let item = req.body;
    let data = await itemService.create(item);
    res.send(data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

// router.get("/:id", async (req, res, next) => {
//   try {
//     let id = req.params.id;
//     res.send(id);
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// });

// router.get("/id", async (req, res, next) => {
//   try {
// ;
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// });

module.exports = router;
