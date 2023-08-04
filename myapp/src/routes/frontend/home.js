const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Model Control
const containService = require("../../services/containService");
//  Model
const articleModel = containService.modelControl.article;
const emailModel = containService.modelControl.email;
const productModel = containService.modelControl.product;
const sliderModel = containService.modelControl.slider;
const userModel = containService.modelControl.user;
const orderModel = containService.modelControl.order;
const sizeModel = containService.modelControl.size;
const couponModel = containService.modelControl.coupon;

//  Service
const articleService = articleModel.articleService;
const productService = productModel.productService;
const sliderService = sliderModel.sliderService;
const userService = userModel.userService;
const orderService = orderModel.orderService;
const sizeService = sizeModel.sizeService;
const couponService = couponModel.couponService;

// Utility
const utilGetParam = require("../../utils/utilParam");
const authToken = require("../../middleware/verifyToken");
const utilMail = require("../../utils/utilMail");
const emailSetup = require("../../middleware/emailSetup");

// -------------------------------------------GET

router.get("/checkout(/:id)?", async (req, res, next) => {
  try {
    res.render("frontend/pages/post/checkout", {
      title: "Homepage",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:id", async (req, res, next) => {
  try {
    let user;
    let orderLatest;
    if (req.session.user_id !== "") {
      user = await userService.getOne({ _id: req.params.id });
      orderLatest = await orderService.getAll({
        customer: { email: user.email },
      });
      return res.render("frontend/pages/post/user", {
        title: "Homepage",
        orderLatest,
      });
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/form(/:action)?", async (req, res, next) => {
  try {
    let logError = "";
    let action = req.params.action;
    res.render(`frontend/pages/post/${action}`, {
      title: "Homepage",
      logError,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/pages(/:setting)?", async (req, res, next) => {
  try {
    let href = req.params.setting;
    let articleItems = {};
    if (href == "articles") {
      articleItems = await articleService.getAll({
        status: "active",
        special: "on",
      });
    }
    res.render(`frontend/pages/setting/${href}`, {
      title: "Homepage",
      articleItems,
    });
  } catch (error) {
    console.log(error);
  }
});

// Index
router.get("/", async (req, res, next) => {
  const [itemSpecial, products, slider, SIZE] = await Promise.all([
    articleService.getSpecial(),
    productService.getAll({}),
    sliderService.getAll({}),
    sizeService.getAll({}),
  ]);
  res.render("frontend/pages/home/index", {
    title: "Homepage",
    itemSpecial,
    products,
    slider,
    SIZE,
  });
});

router.get("/:id", async (req, res, next) => {
  try {
    const url = req.params.id;
    const keyword = req.query.search;
    let searchName;
    let condition;
    let collection;
    let idProduct;
    let idArticle;
    let idCategory;
    let currentCategory;
    let productRelated;

    if (url.includes("-idp=")) {
      collection = productModel.name;
      idProduct = url.split("-idp=")[1];
    } else if (url.includes("-ida=")) {
      collection = articleModel.name;
      idArticle = url.split("-ida=")[1];
    } else if (url.includes("-idc=")) {
      collection = "productsByCategory";
      idCategory = url.split("-idc=")[1];
      currentCategory = url.split("-idc=")[0].toUpperCase();
      searchName = new RegExp(keyword, "ig");
      condition =
        searchName !== ""
          ? { category: idCategory, status: "active", name: searchName }
          : { category: idCategory, status: "active" };
    }

    const [article, product, SIZE, products] = await Promise.all([
      idArticle
        ? articleService.getOne({
            _id: idArticle,
            status: "active",
          })
        : null,
      idProduct
        ? productService.getOne({
            _id: idProduct,
            status: "active",
          })
        : null,
      sizeService.getAll({}),
      idCategory ? productService.getAll(condition) : null,
    ]);

    if (idArticle) {
      productRelated = await productService
        .getAll({ category: { $in: article.category } })
        .limit(4);
    } else if (idProduct) {
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
      products,
      SIZE,
      currentCategory,
      url,
      keyword,
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
  let item = await articleService.getAll(condition).limit(2);
  res.send(item);
});

// Sort product by category
router.get("/category-product/:id", async (req, res, next) => {
  const id = req.params.id;
  const products = await productService.getAll({ category: id });
  res.send(products);
});

// Logout
router.get("/logout/:id", async (req, res, next) => {
  req.session.user_id = "";
  req.session.token = "";
  res.redirect("/");
});

// Profile
router.get("/profile/:id", async (req, res, next) => {
  const id = req.params.id;
  const data = await userService.getOne({ _id: id });
  res.send(data);
});

// Apply coupon
router.get("/apply-coupon/:code", async (req, res, next) => {
  const code = req.params.code;
  let coupon = await couponService.findOne({ name: code });
  res.send(coupon);
});

// -------------------------------------------POST

// register
router.post("/register", async (req, res) => {
  try {
    if (
      req.session.user_id !== "" &&
      typeof req.session.user_id !== "undefined"
    ) {
      return res.redirect("/");
    } else {
      const { username, email, password } = req.body;

      // check if user already exist
      const [existedUser, deletedUser, existedUsername, deletedUsername] =
        await Promise.all([
          userService.findOne({ email, status: "active" }),
          userService.findOne({ email, status: "inactive" }),
          userService.findOne({ username, status: "active" }),
          userService.findOne({ username, status: "inactive" }),
        ]);
      console.log(existedUser);
      if (existedUser || existedUsername) {
        let logError = "User already exists.";
        return res.render("frontend/pages/post/register", {
          title: "Homepage",
          logError,
        });
      } else if (deletedUser || deletedUsername) {
        let logError = "User had been deleted. Please create another account.";
        return res.render("frontend/pages/post/register", {
          title: "Homepage",
          logError,
        });
      }

      // Create user in our database
      const user = await userService.create({
        username,
        email,
        password: password,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, username, isAdmin: user.isAdmin },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      req.session.token = token;
      req.session.user_id = user._id;
      return res.redirect("/form/login");
    }
  } catch (err) {
    console.log(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    if (
      req.session.user_id !== "" &&
      typeof req.session.user_id !== "undefined"
    ) {
      return res.redirect("/");
    } else {
      const { username, password } = req.body;

      const user = await userService.findOne({ username, status: "active" });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user._id, username, isAdmin: user.isAdmin },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        req.session.token = token;
        req.session.user_id = user._id;
        return res.redirect("/");
      }
      let logError = "Password or username is wrong !";
      return res.render("frontend/pages/post/login", {
        title: "Homepage",
        logError,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

// Subscribe email
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

// Create order
router.post("/create-order", async (req, res, next) => {
  let data = req.body;
  let products = JSON.parse(data.products);
  if (products.length <= 0) {
    res.redirect("/");
    return;
  }
  let item = {
    orderID: data.orderID,
    customer: {
      user_id: data.user_id,
      address: data.address,
      email: data.email,
      phone: data.phone,
    },
    products,
    coupon: data.coupon,
    shipFee: parseInt(data.shipFee),
    total: parseFloat(data.total),
  };
  if (data.user_id !== "") {
    await userService.updateOneById(data.user_id, {
      address: data.address,
      email: data.email,
      phone: data.phone,
      name: data.name,
    });
  }

  const existedCoupon = await couponService.findOne({ name: data.coupon });

  const newOrder = await orderService.create(item);
  if (data.email !== "" && typeof data.email !== "undefined") {
    const message = {
      subject: "Order is processing",
      text: newOrder.description,
    };
    const [toClient, toStaff] = await Promise.all([
      utilMail.sendMail(data.email, message),
      utilMail.sendMail(emailSetup, message),
    ]);
  }

  if (existedCoupon && typeof existedCoupon !== "undefined") {
    let newUsed = existedCoupon.used + 1;
    await couponService.updateOneById(existedCoupon._id, { used: newUsed });
  }

  res.render("frontend/pages/post/description", {
    title: "Homepage",
    newOrder,
  });
});

module.exports = router;
