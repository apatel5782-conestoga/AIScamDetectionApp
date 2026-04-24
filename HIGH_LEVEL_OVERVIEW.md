# High-Level Project Overview

## Project Name

AI Scam Detection App

## Purpose

The AI Scam Detection App is designed to help users identify suspicious digital content such as scam messages, phishing links, fake job offers, banking impersonation messages, and other fraud attempts. The goal is to provide users with a clear risk score, explanation, safety recommendations, and a private reporting workflow.

## Problem Being Solved

Many users receive scam messages through email, SMS, phone calls, social media, and fake websites. These scams often create urgency, impersonate trusted organizations, request credentials, or ask for money. This project helps users slow down, analyze the content, understand the red flags, and take safer next steps.

## Main User Roles

### Regular User

A regular user can:

- Sign up and log in
- Submit suspicious content for analysis
- View risk score, verdict, reasons, and recommendations
- Save analysis sessions
- Create private fraud reports
- Download report PDFs
- View recovery and legal guidance

### Admin User

An admin can:

- Log in through admin access
- View fraud reports
- Update report status
- Add admin notes
- Monitor report analytics

## Architecture

The project uses a client-server architecture.

```text
User Browser
   |
   v
React + TypeScript Frontend
   |
   | HTTP API requests
   v
Node.js + Express Backend API
   |
   | Mongoose models
   v
MongoDB Database

External services:
- OpenAI API for AI-assisted scam analysis
- News API / official source scraping for fraud-related news features
```

## Frontend Design

The frontend is built using React, TypeScript, Vite, Tailwind CSS, React Router, and chart/map libraries. It contains separate pages for dashboard, scam detection, reporting, recovery, compliance, profile, login, signup, and admin dashboard.

Key frontend design decisions:

- Component-based structure for maintainability
- Protected routes for profile/admin pages
- API service files to keep network requests separate from UI code
- Reusable UI components such as cards, buttons, headers, and dashboard widgets
- Visual risk indicators for better user understanding

## Backend Design

The backend is built using Node.js, Express, TypeScript, MongoDB, and Mongoose. It separates routes, controllers, services, middleware, and models.

Key backend design decisions:

- Routes define API endpoints
- Controllers handle request and response logic
- Services contain business logic such as analysis, URL checking, chatbot, PDF generation, and news retrieval
- Mongoose models define database structure
- Middleware handles authentication, validation, rate limiting, security headers, and errors
- JWT authentication protects user and admin routes

## Key Design Decisions

### 1. AI-Assisted Analysis With Fallback Logic

The project uses OpenAI for structured fraud analysis. It also includes regex/rule-based fallback analysis, so the system can still provide results if AI analysis fails or is unavailable.

### 2. Explainable Risk Scoring

Instead of only showing “scam” or “not scam,” the app shows risk score, severity, reasons, extracted signals, confidence breakdown, and recommended actions. This helps users understand why something is risky.

### 3. Private Reporting Instead of Public Accusations

The app creates private fraud reports. This avoids public accusations and keeps the workflow safer and more responsible for an academic project.

### 4. Admin Review Workflow

Reports follow a status lifecycle: `pending`, `under_review`, `needs_more_info`, `escalated`, and `closed`. This gives the project a realistic case-management structure.

### 5. Modular Codebase

Frontend and backend code are separated into meaningful folders. This supports scalability and makes the project easier to explain during evaluation.

## Scalability Considerations

The project can be extended by:

- Moving from local MongoDB to MongoDB Atlas
- Deploying frontend and backend separately
- Adding background jobs for news collection
- Adding file scanning for uploaded evidence
- Adding role-based permissions beyond basic user/admin
- Adding test suites for services and API endpoints
- Adding audit logs for admin actions

## Security Considerations

The project includes:

- JWT-based authentication
- bcrypt password hashing
- Helmet security headers
- CORS configuration
- API rate limiting
- Input validation middleware
- Protected routes
- Legal disclaimer acceptance for reports

Important: real `.env` files must not be committed to GitHub. API keys, JWT secrets, and admin passwords should be rotated before final submission.
