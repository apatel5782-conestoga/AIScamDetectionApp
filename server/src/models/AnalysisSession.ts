import { Schema, model } from "mongoose";

export type AnalysisSeverity = "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk";
export type AnalysisVerdict = "Likely Legitimate" | "Suspicious" | "Likely Fraud";

export interface IConfidenceBreakdown {
  psychologicalManipulation: number;
  urgencyPressure: number;
  urlThreat: number;
  emailThreatIndicators: number;
}

export interface IRiskFactor {
  key: string;
  label: string;
  value: number;
  description: string;
}

export interface IRecommendedAction {
  title: string;
  description: string;
  priority: "now" | "soon" | "monitor";
}

export interface ISimilarCase {
  caseId: string;
  title: string;
  scamCategory: string;
  similarityScore: number;
  matchingTraits: string[];
  severity: AnalysisSeverity;
  channel: "Email" | "SMS" | "Phone" | "Social Media" | "Website" | "Other";
  caseSummary?: string;
  sourceType?: "prior_analysis" | "reference_playbook";
}

export interface IGeneratedReportDraft {
  title: string;
  description: string;
  evidenceDescription: string;
  fraudType: string;
  channel: "Email" | "SMS" | "Phone" | "Social Media" | "Website" | "Other";
  severity: AnalysisSeverity;
  suggestedStatus: "pending" | "under_review" | "needs_more_info" | "escalated" | "closed";
}

export interface ICaseTimelineEvent {
  step: string;
  title: string;
  description: string;
}

export interface IEvidenceFile {
  name: string;
  size: number;
  type: string;
}

export interface IAnalysisSession {
  _id?: unknown;
  createdBy?: string;
  messageText: string;
  channel: "Email" | "SMS" | "Phone" | "Social Media" | "Website" | "Other";
  evidenceSummary?: string;
  evidenceFiles: IEvidenceFile[];
  scamCategory: string;
  triageSummary: string;
  extractedSignals: string[];
  fraudType: string;
  riskScore: number;
  confidence: number;
  severity: AnalysisSeverity;
  verdict: AnalysisVerdict;
  reasons: string[];
  confidenceBreakdown: IConfidenceBreakdown;
  riskFactors: IRiskFactor[];
  similarCases: ISimilarCase[];
  recommendedActions: IRecommendedAction[];
  reportDraft: IGeneratedReportDraft;
  caseTimeline: ICaseTimelineEvent[];
  safeUseNotice: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const confidenceBreakdownSchema = new Schema<IConfidenceBreakdown>(
  {
    psychologicalManipulation: { type: Number, required: true },
    urgencyPressure: { type: Number, required: true },
    urlThreat: { type: Number, required: true },
    emailThreatIndicators: { type: Number, required: true },
  },
  { _id: false },
);

const riskFactorSchema = new Schema<IRiskFactor>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const recommendedActionSchema = new Schema<IRecommendedAction>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["now", "soon", "monitor"], required: true },
  },
  { _id: false },
);

const similarCaseSchema = new Schema<ISimilarCase>(
  {
    caseId: { type: String, required: true },
    title: { type: String, required: true },
    scamCategory: { type: String, required: true },
    similarityScore: { type: Number, required: true },
    matchingTraits: { type: [String], required: true },
    severity: {
      type: String,
      enum: ["Low Risk", "Medium Risk", "High Risk", "Critical Risk"],
      required: true,
    },
    channel: {
      type: String,
      enum: ["Email", "SMS", "Phone", "Social Media", "Website", "Other"],
      required: true,
    },
    caseSummary: { type: String },
    sourceType: { type: String, enum: ["prior_analysis", "reference_playbook"] },
  },
  { _id: false },
);

const generatedReportDraftSchema = new Schema<IGeneratedReportDraft>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    evidenceDescription: { type: String, required: true },
    fraudType: { type: String, required: true },
    channel: {
      type: String,
      enum: ["Email", "SMS", "Phone", "Social Media", "Website", "Other"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["Low Risk", "Medium Risk", "High Risk", "Critical Risk"],
      required: true,
    },
    suggestedStatus: {
      type: String,
      enum: ["pending", "under_review", "needs_more_info", "escalated", "closed"],
      required: true,
    },
  },
  { _id: false },
);

const caseTimelineEventSchema = new Schema<ICaseTimelineEvent>(
  {
    step: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const evidenceFileSchema = new Schema<IEvidenceFile>(
  {
    name: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { _id: false },
);

const analysisSessionSchema = new Schema<IAnalysisSession>(
  {
    createdBy: { type: String, index: true },
    messageText: { type: String, required: true, trim: true },
    channel: {
      type: String,
      enum: ["Email", "SMS", "Phone", "Social Media", "Website", "Other"],
      required: true,
    },
    evidenceSummary: { type: String, trim: true },
    evidenceFiles: { type: [evidenceFileSchema], default: [] },
    scamCategory: { type: String, required: true, trim: true, index: true },
    triageSummary: { type: String, required: true, trim: true },
    extractedSignals: { type: [String], required: true, default: [] },
    fraudType: { type: String, required: true, trim: true },
    riskScore: { type: Number, required: true },
    confidence: { type: Number, required: true },
    severity: {
      type: String,
      enum: ["Low Risk", "Medium Risk", "High Risk", "Critical Risk"],
      required: true,
    },
    verdict: { type: String, enum: ["Likely Legitimate", "Suspicious", "Likely Fraud"], required: true },
    reasons: { type: [String], required: true },
    confidenceBreakdown: { type: confidenceBreakdownSchema, required: true },
    riskFactors: { type: [riskFactorSchema], required: true },
    similarCases: { type: [similarCaseSchema], required: true, default: [] },
    recommendedActions: { type: [recommendedActionSchema], required: true },
    reportDraft: { type: generatedReportDraftSchema, required: true },
    caseTimeline: { type: [caseTimelineEventSchema], required: true, default: [] },
    safeUseNotice: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const AnalysisSessionModel = model<IAnalysisSession>("AnalysisSession", analysisSessionSchema);

export default AnalysisSessionModel;
