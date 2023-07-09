const itemService = require("./itemService");
const categoryService = require("./categoryService");
const articleService = require("./articleService");
const emailService = require("./emailService");
const settingService = require("./settingService");
const colorService = require("./colorService");
const sizeService = require("./sizeService");
const productService = require("./productService");
const userService = require("./userService");

exports.modelControl = {
  item: {
    itemService,
    name: "items",
    index: "items/list",
    save: "items/form",
  },
  category: {
    categoryService,
    name: "category",
    index: "category/list",
    save: "category/form",
  },
  article: {
    articleService,
    name: "article",
    index: "article/list",
    save: "article/form",
    folderUpload: "backend/upload/article",
  },
  email: {
    emailService,
    name: "email",
    index: "email/list",
    save: "email/form",
  },
  setting: {
    settingService,
    name: "setting",
    index: "setting",
    save: "setting/form",
    folderUpload: "backend/upload/logo",
  },
  color: {
    colorService,
    name: "color",
    index: "color/list",
    save: "color/form",
  },
  size: {
    sizeService,
    name: "size",
    index: "size/list",
    save: "size/form",
  },
  product: {
    productService,
    name: "product",
    index: "product/list",
    save: "product/form",
    folderUpload: "backend/upload/product",
  },
  user: {
    userService,
    name: "user",
    index: "user/list",
    save: "user/form",
  },
};
