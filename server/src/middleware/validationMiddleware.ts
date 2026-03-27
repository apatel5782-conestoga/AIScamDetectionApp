import { body } from "express-validator";

export const registerValidation = [
  body("name").trim().isLength({ min: 2, max: 80 }),
  body("email").isEmail().normalizeEmail(),
  body("phone").trim().isLength({ min: 7, max: 20 }),
  body("password").isLength({ min: 8, max: 64 }),
];

export const loginValidation = [
  body("identifier").isString().trim().isLength({ min: 2, max: 120 }),
  body("password").isLength({ min: 8, max: 64 }),
];

export const forgotPasswordValidation = [
  body("email").isEmail().normalizeEmail(),
];

export const updateProfileValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 80 }),
  body("username").optional().trim().isLength({ min: 3, max: 40 }),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().trim().isLength({ min: 7, max: 20 }),
];

export const fraudReportValidation = [
  body("title").trim().isLength({ min: 5, max: 150 }),
  body("description").trim().isLength({ min: 20, max: 4000 }),
  body("evidenceDescription").trim().isLength({ min: 10, max: 3000 }),
  body("fraudType").trim().isLength({ min: 2, max: 120 }),
  body("severity").isIn(["Low Risk", "Medium Risk", "High Risk", "Critical Risk"]),
  body("legalDisclaimerAccepted").custom((value) => value === true),
];
