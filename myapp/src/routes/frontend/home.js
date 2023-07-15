const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
// Model
const currentModel = containService.modelControl.article;
const emailModel = containService.modelControl.email;
const productModel = containService.modelControl.product;
const sliderModel = containService.modelControl.slider;
// Service
const mainService = currentModel.articleService;
const productService = productModel.productService;
const sliderService = sliderModel.sliderService;

// Utility
const utilGetParam = require("../../utils/utilParam");

// -------------------------------------------GET

// Index
router.get("/checkout", async (req, res, next) => {
  try {
    res.render("frontend/pages/post/checkout", {
      title: "Homepage",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res, next) => {
  const [itemSpecial, products, slider] = await Promise.all([
    mainService.getSpecial(),
    productService.getAll({}),
    sliderService.getAll({}),
  ]);
  res.render("frontend/pages/home/index", {
    title: "Homepage",
    itemSpecial,
    products,
    slider,
  });
});

// Single-page article, product
router.get("/:id", async (req, res, next) => {
  try {
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

    let article;
    let product;
    let productRelated;

    if (idArticle) {
      article = await mainService.getOne({ _id: idArticle });
      productRelated = await productService
        .getAll({ category: { $in: article.category } })
        .limit(4);
    } else if (idProduct) {
      product = await productService.getOne({ _id: idProduct });
      productRelated = await productService
        .getAll({ category: product.category })
        .limit(4);
    }

    res.render("frontend/pages/post/index", {
      title: "Homepage",
      article,
      product,
      collection,
      productRelated,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Sort article by category
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

// Sort product by category
router.get("/category-product/:id", async (req, res, next) => {
  const id = req.params.id;
  const products = await productService.getAll({ category: id });
  res.send(products);
});

// -------------------------------------------POST

// Add email
router.post("/subscribe", async function (req, res) {
  const item = req.body;
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

module.exports = router;
