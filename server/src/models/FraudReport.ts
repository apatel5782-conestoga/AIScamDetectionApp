import { Schema, model } from "mongoose";

export interface IFraudReport {
  _id?: unknown;
  analysisSessionId?: string;
  title: string;
  description: string;
  evidenceDescription: string;
  fraudType: string;
  channel: string;
  amountLost?: number;
  severity: "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk";
  legalDisclaimerAccepted: boolean;
  status: "pending" | "under_review" | "needs_more_info" | "escalated" | "closed";
  submittedBy: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const fraudReportSchema = new Schema<IFraudReport>(
  {
    analysisSessionId: { type: String, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    evidenceDescription: { type: String, required: true, trim: true },
    fraudType: { type: String, required: true, trim: true },
    channel: { type: String, required: true, trim: true },
    amountLost: { type: Number },
    severity: {
      type: String,
      enum: ["Low Risk", "Medium Risk", "High Risk", "Critical Risk"],
      required: true,
    },
    legalDisclaimerAccepted: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["pending", "under_review", "needs_more_info", "escalated", "closed"],
      default: "pending",
      required: true,
    },
    submittedBy: { type: String, required: true, index: true },
    reviewedBy: { type: String, trim: true },
    reviewedAt: { type: Date },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

const FraudReportModel = model<IFraudReport>("FraudReport", fraudReportSchema);

export default FraudReportModel;
