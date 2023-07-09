const { body, validationResult } = require("express-validator");
const Article = require("../models/articleModel");

exports.validateItemsQueries = [
  body("name")
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name is required"),
    // .custom(async (value) => {
    //   const article = await Article.findOne({ name: value });
    //   if (article) {
    //     throw new Error("Name must be unique");
    //   }
    //   return true;
    // }),
  body("status").notEmpty().withMessage("Status is required"),
  body("special").notEmpty().withMessage("Special is required"),
];

exports.validateItemsErros = (req) => {
  return validationResult(req);
};
