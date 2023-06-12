const { body, validationResult } = require('express-validator');

exports.validateItemsQueries = [
    body('name')
        .notEmpty()
        .isLength({ min: 1, max: 20 })
        .withMessage('Name is required'),
    body('status')
        .notEmpty()
        .withMessage('Status is required'),
    body('ordering')
        .notEmpty()
        .withMessage('Ordering is required')
        .isInt({ gt: 0, lt: 1000 })
        .withMessage('Ordering must be an integer')
]

exports.validateItemsErros = (req) => {
    return validationResult(req);
}