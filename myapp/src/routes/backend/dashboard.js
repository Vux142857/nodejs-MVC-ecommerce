const express = require("express");
const router = express.Router();

// router.use("/", indexRouter);

router.get("/", (req, res, next) => {
  console.log("dashboard");
  res.render("backend/pages/dashboard/index", {
    title: "Dashboard",
  });
});

module.exports = router;
