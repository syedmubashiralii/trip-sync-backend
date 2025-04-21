const { body, validationResult } = require('express-validator');

exports.loginValidationRules = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('type').isIn(['user', 'company', 'guide']).withMessage('Invalid user type')
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};
