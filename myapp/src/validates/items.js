const { body, validationResult } = require("express-validator");

exports.validateItemsQueries = [
  body("name")
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage("Name is required"),
  body("status").notEmpty().withMessage("Status is required"),
  body("ordering")
    .notEmpty()
    .withMessage("Ordering is required")
    .isInt({ gt: 0, lt: 1001 })
    .withMessage("Ordering must be 0 < and <= 1000"),
  body("imgURL")
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Invalid Image URL")
];

exports.validateItemsErros = (req) => {
  return validationResult(req);
};
