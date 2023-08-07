const utilGetParam = require("../utils/utilParam");
module.exports = async (req, res, next) => {
  const user_id = utilGetParam.getParam(req.session, "user_id", "");
  if (user_id !== "") {
    res.redirect("/");
  } else {
    next();
  }
};
