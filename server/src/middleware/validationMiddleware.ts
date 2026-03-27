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

export const analysisSessionValidation = [
  body("messageText").trim().isLength({ min: 10, max: 8000 }),
  body("channel").isIn(["Email", "SMS", "Phone", "Social Media", "Website", "Other"]),
  body("evidenceSummary").optional({ values: "falsy" }).trim().isLength({ min: 5, max: 3000 }),
  body("evidenceFiles").optional().isArray({ max: 10 }),
  body("evidenceFiles.*.name").optional().isString().trim().isLength({ min: 1, max: 255 }),
  body("evidenceFiles.*.size").optional().isInt({ min: 0, max: 50 * 1024 * 1024 }),
  body("evidenceFiles.*.type").optional().isString().trim().isLength({ min: 1, max: 120 }),
];

export const updateProfileValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 80 }),
  body("username").optional().trim().isLength({ min: 3, max: 40 }),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().trim().isLength({ min: 7, max: 20 }),
];

export const fraudReportValidation = [
  body("analysisSessionId").optional({ values: "falsy" }).isString().trim().isLength({ min: 3, max: 80 }),
  body("title").optional({ values: "falsy" }).trim().isLength({ min: 5, max: 150 }),
  body("description").optional({ values: "falsy" }).trim().isLength({ min: 20, max: 4000 }),
  body("evidenceDescription").optional({ values: "falsy" }).trim().isLength({ min: 10, max: 3000 }),
  body("fraudType").optional({ values: "falsy" }).trim().isLength({ min: 2, max: 120 }),
  body("channel").optional({ values: "falsy" }).isIn(["Email", "SMS", "Phone", "Social Media", "Website", "Other"]),
  body("severity").optional({ values: "falsy" }).isIn(["Low Risk", "Medium Risk", "High Risk", "Critical Risk"]),
  body("amountLost").optional({ values: "falsy" }).isFloat({ min: 0, max: 100000000 }),
  body("adminNotes").optional({ values: "falsy" }).trim().isLength({ min: 2, max: 2000 }),
  body("legalDisclaimerAccepted").custom((value) => value === true),
];
