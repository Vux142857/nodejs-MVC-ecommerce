const settingService = require("../services/settingService");

module.exports = emailStaff = async () => {
  const settingModel = await settingService.getAll({});
  const contain =
    settingModel && settingModel.length > 0 ? settingModel[0].contain : "{}";
  const data = contain ? JSON.parse(contain) : {};
  const emailStaff = data.email.staff;
  return emailStaff;
};
