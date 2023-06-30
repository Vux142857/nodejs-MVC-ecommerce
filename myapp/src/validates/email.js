const { body, validationResult } = require("express-validator");
const Email = require("../models/emailModel");

exports.validateItemsQueries = [
  body("name")
    .notEmpty()
    .withMessage("Email is required")
    .custom(async (value) => {
      const email = await Email.findOne({ name: value });
      if (email) {
        throw new Error("Email must be unique");
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
