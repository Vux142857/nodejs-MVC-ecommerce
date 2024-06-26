const settingService = require("../services/settingService");
const categoryService = require("../services/categoryService");
const userService = require("../services/userService");
const advertiseService = require("../services/advertiseService");

// Utility
const utilGetParam = require("../utils/utilParam");

module.exports = async (req, res, next) => {
  const user_id = utilGetParam.getParam(req.session, "user_id", "");
  let currentUser;
  const [categoryParent, categoryArticle, settingModel, advertise] =
    await Promise.all([
      categoryService.getAll({
        status: "active",
        special: "on",
      }),
      categoryService.getAll({
        status: "active",
        special: "off",
      }),
      settingService.getAll({}),
      advertiseService.getAll({ status: "active" }).limit(2),
    ]);
  if (user_id !== "") {
    currentUser = await userService.findOne({ _id: user_id });
  }
  let userInfo = {};
  if (typeof currentUser !== "undefined" && currentUser !== {}) {
    userInfo = {
      id: currentUser._id,
      name: currentUser.name,
      username: currentUser.username,
      email: currentUser.email,
      address: currentUser.address,
      phone: currentUser.phone,
      isAdmin: currentUser.isAdmin,
    };
  }
  const contain =
    settingModel && settingModel.length > 0 ? settingModel[0].contain : "{}";
  const data = contain ? JSON.parse(contain) : {};
  res.locals.data = data;
  res.locals.categoryParent = categoryParent;
  res.locals.categoryArticle = categoryArticle;
  res.locals.userInfo = userInfo;
  res.locals.advertise = advertise;
  next();
};
