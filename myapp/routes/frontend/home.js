const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("frontend/pages/home/index", {
    title: "Homepage",
  });
});

module.exports = router;
