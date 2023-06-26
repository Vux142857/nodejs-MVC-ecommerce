const { body, validationResult } = require("express-validator");
const Category = require("../models/articleModel");

exports.validateItemsQueries = [
  body("name")
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage("Name is required")
    .custom(async (value) => {
      const category = await Category.findOne({ name: value });
      if (category) {
        throw new Error("Name must be unique");
      }
      return true;
    }),
  body("status").notEmpty().withMessage("Status is required"),
  body("ordering")
    .notEmpty()
    .withMessage("Ordering is required")
    .isInt({ gt: 0, lt: 1001 })
    .withMessage("Ordering must be 0 < and <= 1000"),
];

exports.validateItemsErros = (req) => {
  return validationResult(req);
};
