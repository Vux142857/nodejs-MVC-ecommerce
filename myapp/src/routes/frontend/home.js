const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
// Model
const currentModel = containService.modelControl.article;
const subModel = containService.modelControl.category;
const emailModel = containService.modelControl.email;
const settingModel = containService.modelControl.setting;
const productModel = containService.modelControl.product;
const sliderModel = containService.modelControl.slider;
// Service
const mainService = currentModel.articleService;
const subService = subModel.categoryService;
const settingService = settingModel.settingService;
const productService = productModel.productService;
const sliderService = sliderModel.sliderService;

// Utility
const utilGetParam = require("../../utils/utilParam");

router.get("/", async (req, res, next) => {
  const [
    itemSpecial,
    categoryParent,
    categoryArticle,
    setting,
    products,
    slider,
  ] = await Promise.all([
    mainService.getSpecial(),
    subService.getAll({
      status: "active",
      special: "on",
    }),
    subService.getAll({
      status: "active",
      special: "off",
    }),
    settingService.getAll({}),
    productService.getAll({}),
    sliderService.getAll({}),
  ]);
  const contain = setting && setting.length > 0 ? setting[0].contain : "{}";
  const data = contain ? JSON.parse(contain) : {};
  res.render("frontend/pages/home/index", {
    title: "Homepage",
    itemSpecial,
    categoryParent,
    categoryArticle,
    data,
    products,
    slider,
  });
});

router.get("/category/:category_id", async (req, res, next) => {
  const category_id = req.params.category_id;
  let condition = {};
  if (category_id !== "") {
    condition = {
      category: { $elemMatch: { $eq: category_id } },
      status: "active",
      special: "on",
    };
  }
  let item = await mainService.getAll(condition).limit(2);
  res.send(item);
});

router.post("/subscribe", async function (req, res) {
  const item = req.body;
  console.log(item);
  try {
    // Save the subscribed email to the database or perform any desired action
    const email = await emailModel.emailService.create(item);
    res.send(email);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).send("An error occurred while subscribing.");
  }
});

router.get("/category", async (req, res, next) => {
  let item = await mainService.getAll();
  const objString = JSON.stringify(item);
  const obj = JSON.parse(objString);
  res.send(objString);
});

// bottoms-id-64a28b4fe68d25ef4924c6e0
router.get("/category-product/:id", async (req, res, next) => {
  const id = req.params.id;
  const products = await productService.getAll({ category: id });
  res.send(products);
});

router.get("/:id", async (req, res, next) => {
  const url = req.params.id;
  let idArticle = "";
  let idProduct = "";
  let collection;
  if (url.includes("-idp=")) {
    collection = productModel.name;
    idProduct = url.split("-idp=")[1];
  } else {
    collection = currentModel.name;
    idArticle = url.split("-id")[1];
  }

  // const article = await mainService.getAll({ _id: id });
  const [article, categoryParent, categoryArticle, setting, product] =
    await Promise.all([
      mainService.getOne({ _id: idArticle }),
      subService.getAll({
        status: "active",
        special: "on",
      }),
      subService.getAll({
        status: "active",
        special: "off",
      }),
      settingService.getAll({}),
      productService.getOne({ _id: idProduct }),
    ]);

  let productRelated;
  if (url.includes("-idp=")) {
    productRelated = await productService
      .getAll({ category: product.category })
      .limit(4);
  } else if (article) {
    productRelated = await productService
      .getAll({ category: { $in: article.category } })
      .limit(4);
  }

  const contain = setting && setting.length > 0 ? setting[0].contain : "{}";
  const data = contain ? JSON.parse(contain) : {};
  res.render("frontend/pages/post/index", {
    title: "Homepage",
    article,
    product,
    categoryParent,
    categoryArticle,
    data,
    collection,
    productRelated,
  });
});

module.exports = router;
