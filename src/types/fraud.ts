export type FraudSeverity = "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk";

export interface RiskFactor {
  key: string;
  label: string;
  value: number;
  description: string;
}

export interface ConfidenceBreakdown {
  psychologicalManipulation: number;
  urgencyPressure: number;
  urlThreat: number;
  emailThreatIndicators: number;
}

export interface FraudAnalysis {
  id: string;
  message: string;
  riskScore: number;
  confidence: number;
  severity: FraudSeverity;
  verdict: "Likely Fraud" | "Likely Legitimate";
  reasons: string[];
  confidenceBreakdown: ConfidenceBreakdown;
  riskFactors: RiskFactor[];
  shouldEscalate: boolean;
  timestamp: string;
}

export interface EscalationEvent {
  id: string;
  timestamp: string;
  severity: FraudSeverity;
  riskScore: number;
  messagePreview: string;
  action: "ANALYZED" | "HIGH_RISK_FLAGGED" | "CRITICAL_REPORTED";
}

export interface ReportToAuthoritiesPayload {
  analysisId: string;
  summary: string;
  riskScore: number;
  severity: FraudSeverity;
  region?: string;
}

export interface ReportToAuthoritiesResponse {
  success: boolean;
  referenceId: string;
  destination: string;
  status: "queued" | "failed";
}
