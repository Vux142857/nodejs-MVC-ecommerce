const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.app.set("layout", "frontend/layouts/index");
  next();
});

router.get("/", require("./home"));

module.exports = router;
