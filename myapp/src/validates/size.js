const { body, validationResult } = require("express-validator");
const Size = require("../models/sizeModel");

exports.validateItemsQueries = [
  body("name")
    .notEmpty()
    .withMessage("Size is required")
    .custom(async (value) => {
      const size = await Size.findOne({ name: value });
      if (size) {
        throw new Error("Size must be unique");
      }
      return true;
    }),
  body("status").notEmpty().withMessage("Status is required"),
];

exports.validateItemsErros = (req) => {
  return validationResult(req);
};
