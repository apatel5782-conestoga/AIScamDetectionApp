# Low-Level Technical Documentation

## Backend Modules

### authRoutes.js

Handles:

* register user
* login user
* token generation

### scanRoutes.js

Handles:

* receive suspicious content
* call detection engine
* return results

### reportRoutes.js

Handles:

* fraud reports
* admin review

## Detection Functions

### analyzeInput(text)

Receives text and starts analysis pipeline.

### detectKeywords(text)

Checks for terms like:

* urgent
* verify now
* OTP
* click here
* payment failed

### detectSuspiciousLinks(url)

Checks:

* strange domains
* shortened links
* fake brand spellings

### calculateRiskScore(flags)

Returns 0–100 score.

### classifyScam(score, flags)

Possible outputs:

* Phishing
* Banking Scam
* Fake Job Scam
* OTP Fraud
* Low Risk / Safe

## Frontend Components

### Navbar.tsx

Navigation across pages.

### Dashboard.tsx

Main scanner UI.

### ResultCard.tsx

Displays:

* risk score
* explanation
* recommendations

### History.tsx

Displays previous scans.

### ReportFraud.tsx

Allows user reporting.

## Example Data Structures

### User Schema

```json
{
  "name": "User",
  "email": "user@email.com",
  "password": "hashed",
  "role": "user"
}
```

### Scan Schema

```json
{
  "input": "message text",
  "score": 88,
  "type": "Phishing",
  "createdAt": "date"
}
```

## API Examples

### POST /api/scan

Request:

```json
{
  "text": "Your account locked. Verify now."
}
```

Response:

```json
{
  "score": 92,
  "type": "Phishing",
  "reasons": ["Urgency", "Credential request"]
}
```

## Error Handling

* Empty input blocked
* Invalid token rejected
* Server errors return message

## Coding Standards

* Reusable functions
* Clear variable names
* Separated concerns
* Commented logic
