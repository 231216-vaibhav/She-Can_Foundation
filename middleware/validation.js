const { body, validationResult } = require('express-validator');

// Validation rules for submitting the contact form
const validateSubmission = [
    body('name')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
        .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters')
        .escape(),
        
    body('email')
        .trim()
        .notEmpty().withMessage('Email address is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
        
    body('message')
        .trim()
        .notEmpty().withMessage('Message content is required')
        .isLength({ min: 5 }).withMessage('Message must be at least 5 characters long')
        .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
        .escape(),
        
    // Middleware to catch validation errors and return 400
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            });
        }
        next();
    }
];

module.exports = {
    validateSubmission
};
