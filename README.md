# README.md

# AI Scam Detection App

## Final Capstone Project

A full-stack fraud detection and reporting platform developed by a team of five students.

---

# Team Members

* Aum Patel
* Muni Narendra
* Vineeth
* Ram Kumar
* Shareen

---

# Project Overview

AI Scam Detection App is a modern cybersecurity web application that helps users detect suspicious scams, phishing messages, fake job offers, fake banking alerts, OTP fraud, malicious links, social media scams, and website fraud attempts.

The system allows users to paste suspicious text, emails, messages, or links into the platform. It then analyzes the content and returns:

* Risk Score
* Scam Verdict
* Scam Category
* Severity Level
* Red Flag Reasons
* Confidence Breakdown
* Safety Recommendations
* Private Fraud Report Option

This project was built as an academic capstone to demonstrate full-stack development, cybersecurity awareness, AI-assisted logic systems, authentication, reporting workflows, and scalable architecture. 

---

# Problem Statement

Online scams are increasing rapidly. Many people lose money or personal information because they cannot identify fraud signs in time.

Common examples:

* Fake banking messages
* OTP theft scams
* Fake package delivery links
* Fake job offers
* Phishing login pages
* Romance scams
* Payment request scams
* Social media impersonation scams

Our project helps users detect these threats early and take safe action before becoming victims.

---

# Main Features

## User Features

* User Registration
* Secure Login
* Demo Login
* Profile Dashboard
* Protected Routes

## Scam Detection Engine

* Analyze suspicious messages
* Analyze suspicious URLs
* Detect phishing patterns
* Detect urgency language
* Detect credential theft attempts
* Detect fake payment scams
* Detect fake job scams
* Detect OTP scams

## Smart Results

* Risk Score (0–100)
* Verdict (Safe / Warning / Dangerous)
* Scam Category
* Severity Level
* Confidence Percentage
* Reasons for detection
* Suggested next steps

## Reporting System

* Create private fraud reports
* Track report history
* Export report as PDF

## Admin Features

* Admin Dashboard
* View submitted reports
* Update report status
* Add internal notes
* View analytics

## Extra Features

* Chatbot for scam safety help
* Recovery center guidance
* Legal/compliance awareness page
* Charts and visual dashboards



---

# Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Chart.js
* Leaflet Maps

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* MongoDB
* Mongoose

## Security

* JWT Authentication
* bcryptjs Password Hashing
* Helmet
* CORS
* Rate Limiting
* Validation Middleware

## AI / Logic Layer

* AI-assisted analysis
* Rule-based fallback logic
* Risk scoring engine



---

# Team Contributions

## Aum Patel

* Frontend UI Design
* Dashboard pages
* Responsive layouts
* Styling using Tailwind CSS
* Navigation components

## Muni Narendra

* Backend APIs
* MongoDB integration
* Routes and controllers
* Database schema setup

## Vineeth

* Scam detection logic
* Risk score system
* Full project integration
* Testing and debugging

## Ram Kumar

* Authentication system
* JWT security
* Protected routes
* GitHub management
* Deployment support

## Shareen

* Documentation
* README files
* Presentation support
* AI disclosure and reporting docs

---

# Project Structure

```text
AIScamDetectionApp/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── routes/
│   ├── hooks/
│   ├── context/
│   └── utils/
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│
├── README.md
├── CONTRIBUTING.md
└── package.json
```



---

# Environment Setup

## Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5050/api
```

## Backend `server/.env`

```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/aifrauddb
JWT_SECRET=replace_with_secret
JWT_EXPIRES_IN=1d
OPENAI_API_KEY=your_key
NEWS_API_KEY=your_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

Never upload real secrets to GitHub.

---

# Installation Guide

## 1. Clone Repository

```bash
git clone <your-github-link>
cd AIScamDetectionApp
```

## 2. Install Frontend

```bash
npm install
```

## 3. Install Backend

```bash
cd server
npm install
```

## 4. Start Backend

```bash
npm run dev
```

Runs on:

```text
http://localhost:5050
```

## 5. Start Frontend

Open second terminal:

```bash
npm run dev
```

Runs on:

```text
http://localhost:5173
```

---

# Main API Endpoints

## Authentication

* POST /api/auth/register
* POST /api/auth/login
* POST /api/auth/demo

## Analysis

* POST /api/analyses
* GET /api/analyses/mine

## Reports

* POST /api/reports
* GET /api/reports/mine
* GET /api/reports/:id/pdf

## Admin

* GET /api/admin/reports
* PATCH /api/admin/reports/:id/status
* GET /api/admin/analytics

## Other

* GET /api/health
* /api/chatbot
* /api/news



---

# Recommended Demo Flow

1. Register/Login
2. Open Scam Analyzer
3. Paste suspicious message
4. Click Analyze
5. Review score and warnings
6. Generate fraud report
7. Login as admin
8. Review report dashboard
9. Update report status
10. Export report PDF

---

# Example Scam Inputs

## Fake Bank Message

> Your bank account is locked. Verify now using this secure link.

## Fake Job Offer

> Congratulations! You are selected. Pay registration fee immediately.

## OTP Scam

> Share your OTP to receive cashback reward.

---

# Future Roadmap

* Mobile App
* Browser Extension
* Real-time Email Scanner
* OCR Screenshot Detection
* Voice Scam Detection
* Fraud Heatmap
* Government Reporting Integration

---

# Security Best Practices

* Password hashing
* JWT sessions
* Role-based access
* Input validation
* Rate limiting
* Private reports
* Protected admin dashboard

---

# Academic Disclaimer

This project was created for educational purposes as a capstone demonstration. It provides AI-assisted scam risk analysis and awareness guidance. It should not be treated as legal, banking, police, or forensic evidence.

---

# Final Result

Our team successfully built a professional cybersecurity platform that combines AI logic, fraud detection, secure authentication, reporting systems, analytics dashboards, and user-friendly design.

This project demonstrates teamwork, software engineering, cybersecurity awareness, and real-world problem solving.
