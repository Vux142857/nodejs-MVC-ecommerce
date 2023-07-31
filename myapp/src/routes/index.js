const express = require("express");
const router = express.Router();
const authToken = require("../middleware/verifyToken");
router.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

router.use("/admin", authToken, require("./backend"));
// router.use("/admin", require("./backend"));
router.use("/", require("./frontend"));

module.exports = router;
