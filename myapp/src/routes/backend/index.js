const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.app.set("layout", "backend/layouts/index");
  next();
});

router.use("/", require("./dashboard"));
router.use("/items", require("./items"));
router.use("/category", require("./category"));
router.use("/article", require("./article"));
router.use("/email", require("./email"));
router.use("/setting", require("./setting"));
router.use("/color", require("./product/color"));
router.use("/size", require("./product/size"));
// router.use("/product", require("./product/product"));


module.exports = router;
