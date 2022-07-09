// const { check, validationResult } = require('express-validator');
import { check, validationResult } from 'express-validator';

export const validateRegister = [
  check('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('username field cannot be empty')
    .isLength({ min: 5, max: 20 })
    .withMessage('Username must be between 5 and 20 characters long'),
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password field cannot be empty')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters long'),

];




export const validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (!error.length) return next();

  res.status(400).json({ success: false, error: error[0].msg });
};
