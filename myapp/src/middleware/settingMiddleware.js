const setting = require("../services/settingService");
const categoryService = require("../services/categoryService");
module.exports = async (req, res, next) => {
  const [categoryParent, categoryArticle, settingModel] = await Promise.all([
    categoryService.getAll({
      status: "active",
      special: "on",
    }),
    categoryService.getAll({
      status: "active",
      special: "off",
    }),
    setting.getAll({}),
  ]);
  const contain =
    settingModel && settingModel.length > 0 ? settingModel[0].contain : "{}";
  const data = contain ? JSON.parse(contain) : {};
  req.app.locals.data = data;
  res.locals.categoryParent = categoryParent;
  res.locals.categoryArticle = categoryArticle;
  next();
};
