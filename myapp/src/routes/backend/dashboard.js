const express = require("express");
const router = express.Router();
// const socket = require("../../../app/socketio");
// Model Control
const containService = require("../../services/containService");
const articleModel = containService.modelControl.article;
const productModel = containService.modelControl.product;
const orderModel = containService.modelControl.order;
const articleService = articleModel.articleService; // Service
const productService = productModel.productService;
const orderService = orderModel.orderService;

router.get("/", async (req, res, next) => {
  const [articleCount, productCount, orderList] = await Promise.all([
    articleService.count({ status: "active" }),
    productService.count({ status: "active" }),
    orderService.getAll({ status: "active" }).limit(10),
  ]);
  const article = {
    count: articleCount,
    index: articleModel.index,
  };
  const product = {
    count: productCount,
    index: productModel.index,
  };

  res.render("backend/pages/dashboard/index", {
    title: "Dashboard",
    article,
    product,
    orderList,
  });
});

module.exports = router;
