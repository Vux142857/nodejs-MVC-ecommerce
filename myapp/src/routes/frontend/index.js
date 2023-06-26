const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.app.set("layout", "frontend/layouts/index");
  next();
});

router.use("/", require("./home"));
router.use("/post", require("./post"));

module.exports = router;
