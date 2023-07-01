const itemService = require("./itemService");
const categoryService = require("./categoryService");
const articleService = require("./articleService");
const emailService = require("./emailService");
const settingService = require("./settingService");
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
};
