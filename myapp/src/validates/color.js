const { body, validationResult } = require("express-validator");
const Color = require("../models/colorModel");

exports.validateItemsQueries = [
  body("name")
    .notEmpty()
    .withMessage("color is required")
    .custom(async (value) => {
      const color = await Color.findOne({ name: value });
      if (color) {
        throw new Error("color must be unique");
      }
      return true;
    }),
  body("status").notEmpty().withMessage("Status is required"),
  body("hex")
    .notEmpty()
    .withMessage("Hex color code is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Invalid hex color code"),
];

exports.validateItemsErros = (req) => {
  return validationResult(req);
};
