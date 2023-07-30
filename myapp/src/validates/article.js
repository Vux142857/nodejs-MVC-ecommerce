const { body, validationResult } = require("express-validator");

exports.validateItemsQueries = [
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
