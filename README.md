# AI Fraud Intelligence & Protection System

Enterprise-grade full-stack academic platform for fraud intelligence, detection, private reporting, escalation simulation, location-based risk analytics, and compliance-safe recovery workflows.

## Academic and Legal Disclaimer

This project is an academic demonstration only.

- No public accusation workflows are provided.
- Reports are private and access-controlled.
- Output is informational and not legal advice.
- Use official authorities for real incidents.

## Technology Stack

Frontend
- React + TypeScript + Vite
- Tailwind CSS
- Chart.js (`react-chartjs-2`)
- Mapbox GL (token-based interactive map)

Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- Bcrypt password hashing
- PDF generation via PDFKit
- Helmet, rate limiting, sanitization, validation

## Frontend Structure

```text
src/
  components/
    EventLogPanel.tsx
    Footer.tsx
    FraudAnalysisCard.tsx
    LegalDisclaimer.tsx
    RegionalAnalyticsCharts.tsx
    RegionalRiskMap.tsx
    RiskBreakdown.tsx
    RiskFactorVisualization.tsx
    SecurityRecommendations.tsx
    SeverityIndicator.tsx
  context/
    AuthContext.tsx
  data/
    canadaRegionalFraudData.ts
  hooks/
    useGeolocation.ts
  models/
    AuthUser.ts
    FraudReport.ts
  pages/
    AboutPage.tsx
    AdminDashboardPage.tsx
    FraudDetectionPage.tsx
    FraudReportingCenterPage.tsx
    HomePage.tsx
    LegalCompliancePage.tsx
    LocationRiskIntelligencePage.tsx
    LoginPage.tsx
    RecoveryCenterPage.tsx
    SignupPage.tsx
  routes/
    ProtectedRoute.tsx
  services/
    api.ts
    FraudAnalysisService.ts
    fraudReportService.ts
  types/
    fraud.ts
  utils/
    eventLogger.ts
    severityEngine.ts
```

## Backend Structure

```text
server/
  src/
    config/
      database.ts
      env.ts
      express.d.ts
      xss-clean.d.ts
    controllers/
      adminController.ts
      authController.ts
      healthController.ts
      reportController.ts
    middleware/
      authMiddleware.ts
      errorMiddleware.ts
      validationMiddleware.ts
    models/
      FraudReport.ts
      SystemLog.ts
      User.ts
    routes/
      adminRoutes.ts
      authRoutes.ts
      reportRoutes.ts
    services/
      pdfService.ts
    utils/
      securityChecklist.ts
    app.ts
    index.ts
```

## Enterprise Pages

- Home
- Fraud Detection Engine
- Location Risk Intelligence (`Fraud Map & Regional Alerts`)
- Fraud Reporting Center
- Fraud Recovery Center
- Legal & Compliance
- Admin Dashboard (Protected)
- About

## AI Fraud Detection Engine

### Severity Rules
- `0-40` => Low Risk
- `41-70` => Medium Risk
- `71-85` => High Risk
- `86-100` => Critical Risk

### Detection Signals
- Psychological manipulation
- Urgency pressure
- URL threat patterns
- Email threat indicators
- Weighted confidence calculation

### Escalation Logic
- Critical risk triggers emergency alert and `Report to Authorities` action
- Mock police notification API call
- Escalation event logging
- High risk prompts bank/financial-institution contact guidance

## Fraud Reporting System (Legal-Safe)

- Private report submission only
- Legal disclaimer acceptance required
- Evidence description capture
- PDF export endpoint
- Role-based admin review workflow
- Input validation and sanitization
- Rate-limited API endpoints

## Location Risk Intelligence

- Browser geolocation integration
- Mapbox interactive regional heat indicators
- Chart.js regional frequency analytics
- Fraud type distribution chart
- Canada-only mock academic dataset

## Security Architecture Checklist

- JWT auth with expiring tokens
- Role-based access control (`user`, `admin`)
- Bcrypt password hashing
- Helmet secure headers
- API rate limiting
- `express-validator` input validation
- Mongo and XSS sanitization middleware
- Private-by-default report storage
- Defamation misuse safeguards (no public naming/public feeds)
- Encryption at rest via database deployment controls (architecture guidance)

## API Route Structure

Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

Reports
- `POST /api/reports` (auth)
- `GET /api/reports/mine` (auth)
- `GET /api/reports/:id/pdf` (auth)

Admin
- `GET /api/admin/reports` (admin)
- `PATCH /api/admin/reports/:id/status` (admin)
- `GET /api/admin/analytics` (admin)

Health
- `GET /api/health`

## Environment Variables

Frontend (`.env`)
- `VITE_API_BASE_URL`
- `VITE_MAPBOX_TOKEN`

Backend (`server/.env`)
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Run Instructions

Frontend
```bash
npm install
npm run dev
```

Backend
```bash
cd server
npm install
npm run dev
```

Build
```bash
npm run build
cd server && npm run build
```
