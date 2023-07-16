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
//  Service
const articleService = articleModel.articleService;
const productService = productModel.productService;
const sliderService = sliderModel.sliderService;
const userService = userModel.userService;

// Utility
const utilGetParam = require("../../utils/utilParam");
const authToken = require("../../middleware/verifyToken");

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
    articleService.getSpecial(),
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
    let article;
    let product;
    let productRelated;

    if (url.includes("-idp=")) {
      collection = productModel.name;
      idProduct = url.split("-idp=")[1];
      product = await productService.getOne({ _id: idProduct });
      productRelated = await productService
        .getAll({ category: product.category })
        .limit(4);
    } else if (url.includes("-ida=")) {
      collection = articleModel.name;
      idArticle = url.split("-ida=")[1];
      article = await articleService.getOne({ _id: idArticle });
      productRelated = await productService
        .getAll({ category: { $in: article.category } })
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

// Add to cart
router.get("/add-to-cart/:id", async (req, res, next) => {
  const id = req.params.id;
  const product = await productService.getOne({ _id: id });

  if (!req.session.listCart) {
    req.session.listCart = []; // Initialize the listCart array if it doesn't exist
  }
  let data = {};
  if (!req.session.listCart.some((item) => item.name === product.name)) {
    data = {
      _id: product._id,
      name: product.name,
      img: product.img,
      size: product.size,
      price: product.price,
    };
    req.session.listCart.push(data);
  }
  res.send(req.session.listCart);
});

// -------------------------------------------POST

// register
router.post("/register", async (req, res) => {
  try {
    if (
      req.session.user_id !== "" &&
      typeof req.session.user_id !== "undefined"
    ) {
      res.redirect("/");
    } else {
      const { username, email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }

      // check if user already exist
      const [existedUser, deletedUser] = await Promise.all([
        userService.findOne({ username, status: "active" }),
        userService.findOne({ username, status: "inactive" }),
      ]);

      if (existedUser) {
        return res.status(409).send("User Already Exist. Please Login");
      } else if (deletedUser) {
        return res
          .status(409)
          .send("User Had Been Deleted. Please create another");
      }

      // Create user in our database
      const user = await userService.create({
        username,
        email: email.toLowerCase(),
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
      return res.redirect("/");
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

      if (!(username && password)) {
        return res.status(400).send("All input is required");
      }

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
      return res.status(400).send("Invalid Credentials");
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

module.exports = router;
