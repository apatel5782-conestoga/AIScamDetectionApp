import { Schema, model } from "mongoose";

export interface IFraudReport {
  _id?: unknown;
  title: string;
  description: string;
  evidenceDescription: string;
  fraudType: string;
  channel: string;
  amountLost?: number;
  severity: "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk";
  legalDisclaimerAccepted: boolean;
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const fraudReportSchema = new Schema<IFraudReport>(
  {
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
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", required: true },
    submittedBy: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

const FraudReportModel = model<IFraudReport>("FraudReport", fraudReportSchema);

export default FraudReportModel;
