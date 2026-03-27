export const securityArchitectureChecklist = [
  "JWT authentication with expiry and signed claims",
  "Role-based access control middleware",
  "Bcrypt password hashing (12 salt rounds)",
  "Helmet secure headers",
  "Rate limiting on API routes",
  "Input validation with express-validator",
  "Mongo query sanitization and XSS filtering",
  "Private report storage (no public accusations)",
  "Admin-only approval workflow",
  "Encryption at rest via MongoDB storage-level encryption (deployment architecture)",
];
