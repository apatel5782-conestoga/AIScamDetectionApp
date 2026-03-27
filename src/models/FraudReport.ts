import type { FraudChannel, FraudSeverity } from "../types/fraud";

export type FraudReportStatus = "pending" | "under_review" | "needs_more_info" | "escalated" | "closed";

export interface FraudReport {
  _id?: string;
  analysisSessionId?: string;
  title: string;
  description: string;
  evidenceDescription: string;
  fraudType: string;
  channel: FraudChannel;
  amountLost?: number;
  severity: FraudSeverity;
  status: FraudReportStatus;
  submittedBy?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  legalDisclaimerAccepted: boolean;
}

export type FraudReportDraft = {
  analysisSessionId?: string;
  title?: string;
  description?: string;
  evidenceDescription?: string;
  fraudType?: string;
  channel?: FraudChannel;
  amountLost?: number;
  severity?: FraudSeverity;
  legalDisclaimerAccepted: boolean;
};
