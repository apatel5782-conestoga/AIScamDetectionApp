# AI-Assisted Fraud Triage and Reporting

Focused academic full-stack project for analyzing suspicious messages, explaining risk signals, and converting triage results into private case reports.

## Product Direction

This version is intentionally narrower and more credible than the original broad concept.

Core workflow:
1. User submits suspicious content for triage.
2. The app returns a risk score, verdict, reasons, and recommended next steps.
3. The user can convert that analysis into a private report with minimal re-entry.
4. An admin can review the report, update case status, and leave internal notes.

## Academic Framing

- Academic demonstration only.
- Analysis output is AI-assisted and heuristic, not legal or forensic proof.
- Reports are private and access-controlled.
- No public accusation workflow is provided.

## Main Features

- Guided scam checker for suspicious email, SMS, phone, social, or web content
- Explainable risk scoring with reason breakdown and recommended actions
- Private reporting flow linked to stored analysis sessions
- User dashboard with saved analyses and report history
- Admin review queue with case lifecycle statuses
- PDF export for authorized reports
- Recovery and compliance guidance pages

## Stack

Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

Backend
- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- JWT auth
- PDFKit

## Case Lifecycle

Reports move through this status model:

- `pending`
- `under_review`
- `needs_more_info`
- `escalated`
- `closed`

## API Overview

Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/demo`
- `POST /api/auth/forgot-password`

Analysis
- `POST /api/analyses`
- `GET /api/analyses/mine`

Reports
- `POST /api/reports`
- `GET /api/reports/mine`
- `GET /api/reports/:id/pdf`

Admin
- `GET /api/admin/reports`
- `PATCH /api/admin/reports/:id/status`
- `GET /api/admin/analytics`

Health
- `GET /api/health`

## Environment

Frontend `.env`
```bash
VITE_API_BASE_URL=http://localhost:5050/api
```

Backend `server/.env`
```bash
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/aifrauddb
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRES_IN=1d
```

## Run

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

## Recommended Demo Path

1. Sign in or use the demo login.
2. Open `Analyze` and submit a suspicious message.
3. Review the verdict, reasons, and recommended actions.
4. Open `Reports` and submit the pre-filled private case.
5. Sign in as admin demo and update the case status in the review queue.
