# Future Features / Roadmap

## Short-Term Improvements

### 1. Stronger Input Validation

Add more validation rules for suspicious content, report descriptions, amount lost, and evidence fields. This will reduce incomplete reports and improve data quality.

### 2. Better Error Messages

Improve user-facing error messages for failed login, backend connection issues, invalid report submission, and PDF download errors.

### 3. Test Suite

Add automated tests for:

- analysis service
- authentication routes
- report routes
- admin routes
- protected frontend routes

### 4. Clean Production Repository

Before deployment or final public GitHub submission:

- remove `node_modules`
- remove `dist`
- remove real `.env` files
- keep `.env.example`
- rotate exposed API keys and passwords
- confirm repository visibility/collaborator access

## Medium-Term Improvements

### 5. Advanced Evidence Uploads

Support uploaded screenshots, PDFs, emails, or text files with safer file validation and better content extraction.

### 6. More Detailed URL Intelligence

Improve URL analysis with domain age checks, DNS lookup, safe browsing APIs, redirect visualization, and known phishing database matching.

### 7. Role-Based Permissions

Add more roles beyond user/admin, such as reviewer, analyst, and support staff.

### 8. Audit Logging

Track admin actions such as status changes, notes, and report access for accountability.

### 9. Notification System

Notify users when their report status changes or when more information is required.

## Long-Term Improvements

### 10. Real-Time Fraud Trend Dashboard

Add live trend monitoring from official public fraud sources, cybersecurity feeds, and government alerts.

### 11. Machine Learning Risk Model

Train a custom academic dataset-based model to classify fraud types and compare its output with AI/rule-based scoring.

### 12. Multilingual Scam Detection

Support common languages used by students and newcomers in Canada, such as Hindi, Telugu, Punjabi, French, and Spanish.

### 13. Mobile App Version

Create a React Native mobile version where users can quickly paste SMS messages or suspicious links.

### 14. Deployment

Deploy frontend and backend using services such as:

- Vercel/Netlify for frontend
- Render/Railway/Azure/AWS for backend
- MongoDB Atlas for database

### 15. Secure Production Authentication

Add email verification, password reset tokens, refresh tokens, stronger admin authentication, and optional multi-factor authentication.
