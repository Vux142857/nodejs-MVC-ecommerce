const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

router.use("/admin", require("./backend"));
router.use("/", require("./frontend"));

module.exports = router;
