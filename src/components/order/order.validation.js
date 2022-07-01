import { check, validationResult } from "express-validator";

export const validateEventData = [
  check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title field cannot be empty")
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be between 2 and 20 characters long"),

  check("vendor")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title field cannot be empty"),

  check("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Description field cannot be empty"),
  check("phone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone field cannot be empty"),
];

export const validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (!error.length) return next();

  res.status(400).json({ success: false, error: error[0].msg });
};
