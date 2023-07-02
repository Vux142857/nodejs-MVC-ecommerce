const express = require("express");
const router = express.Router();
const Parser = require("rss-parser");

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.setting;
const mainService = currentModel.settingService; // Service

// Utility
const utilGetParam = require("../../utils/utilParam");
const validateItems = require("../../validates/article");
const utilUpload = require("../../utils/utilUpload.js");
const uploadFileMiddleware = utilUpload.upload("logo", "logo");
const parser = new Parser();

// ---------------------------------------------------------------GET

// Get form edit or add
router.get("/", async (req, res, next) => {
  const title = currentModel.name;
  const item = await mainService.getAll({});
  const contain = item && item.length > 0 ? item[0].contain : "{}";
  const data = contain ? JSON.parse(contain) : {};
  const errorsNotify = [];

  res.render(`backend/pages/${currentModel.save}`, {
    title,
    errorsNotify,
    collection: currentModel.name,
    item,
    data,
  });
});

router.post("/save", uploadFileMiddleware, async (req, res, next) => {
  try {
    const item = req.body;
    
    // Upload and Edit image
    if (typeof req.file == "undefined") {
      item.logo = item.logo_old == "" ? "no-img.jpg" : item.logo_old;
    } else {
      item.logo = req.file.filename;
      if (item.logo !== item.logo_old) {
        utilUpload.remove(currentModel.folderUpload, item.logo_old);
      }
    }
    console.log(item.logo);
    
    let data = {
      contain: JSON.stringify({
        logo: item.logo,
        contact: {
          email: item.email,
          phone: item.phone,
          facebook: item.facebook,
          address: item.address,
        },
        privacy: {
          copyright: item.copyright,
          doc: item.doc,
        },
      }),
    };

    let existedItem = await mainService.getAll();
    if (existedItem && typeof existedItem !== "undefined") {
      await mainService.updateOneById(item.id, data);
      req.flash("successMessage", "Item updated successfully");
    } else {
      await mainService.create(data);
      req.flash("successMessage", "Item created successfully");
    }
    res.redirect(`/admin/${currentModel.index}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
