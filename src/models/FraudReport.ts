export interface FraudReport {
  _id?: string;
  title: string;
  description: string;
  evidenceDescription: string;
  fraudType: string;
  channel: "Email" | "SMS" | "Phone" | "Social Media" | "Website" | "Other";
  amountLost?: number;
  severity: "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk";
  status: "pending" | "approved" | "rejected";
  submittedAt?: string;
  reviewedBy?: string;
  legalDisclaimerAccepted: boolean;
}
