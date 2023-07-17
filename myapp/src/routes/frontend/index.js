const express = require("express");
const router = express.Router();
const setting = require("../../middleware/setting");
router.use(async (req, res, next) => {
  req.app.set("layout", "frontend/layouts/index");
  next();
});

router.use("/", setting, require("./home"));

module.exports = router;
