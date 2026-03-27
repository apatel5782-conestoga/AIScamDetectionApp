export type FraudChannel = "Email" | "SMS" | "Phone" | "Social Media" | "Website" | "Other";
export type FraudSeverity = "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk";
export type FraudVerdict = "Likely Legitimate" | "Suspicious" | "Likely Fraud";

export interface EvidenceFileMeta {
  name: string;
  size: number;
  type: string;
}

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

export interface RecommendedAction {
  title: string;
  description: string;
  priority: "now" | "soon" | "monitor";
}

export interface SimilarCase {
  caseId: string;
  title: string;
  scamCategory: string;
  similarityScore: number;
  matchingTraits: string[];
  severity: FraudSeverity;
  channel: FraudChannel;
}

export interface GeneratedReportDraft {
  title: string;
  description: string;
  evidenceDescription: string;
  fraudType: string;
  channel: FraudChannel;
  severity: FraudSeverity;
  suggestedStatus: "pending" | "under_review" | "needs_more_info" | "escalated" | "closed";
}

export interface CaseTimelineEvent {
  step: string;
  title: string;
  description: string;
}

export interface FraudAnalysis {
  id: string;
  message: string;
  channel: FraudChannel;
  evidenceSummary?: string;
  evidenceFiles: EvidenceFileMeta[];
  scamCategory: string;
  triageSummary: string;
  extractedSignals: string[];
  fraudType: string;
  riskScore: number;
  confidence: number;
  severity: FraudSeverity;
  verdict: FraudVerdict;
  reasons: string[];
  confidenceBreakdown: ConfidenceBreakdown;
  riskFactors: RiskFactor[];
  similarCases: SimilarCase[];
  recommendedActions: RecommendedAction[];
  reportDraft: GeneratedReportDraft;
  caseTimeline: CaseTimelineEvent[];
  safeUseNotice: string;
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
