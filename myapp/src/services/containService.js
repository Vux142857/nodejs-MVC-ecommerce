const itemService = require("./itemService");
const categoryService = require("./categoryService");
const articleService = require("./articleService");

exports.modelControl = {
  item: { itemService, name: "items", index: "items/list", save: "items/form" },
  category: { categoryService, name: "categories", index: "" },
  article: { articleService, name: "articles", index: "" },
};
