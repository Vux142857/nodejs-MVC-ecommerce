const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.app.set("layout", "backend/layouts/index");
  next();
});

router.use("/", require("./dashboard"));
router.use("/items", require("./items"));
router.use("/demo", require("./demo"));
router.use("/category", require("./category"));


module.exports = router;
