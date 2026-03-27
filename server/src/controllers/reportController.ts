import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import AnalysisSessionModel from "../models/AnalysisSession";
import FraudReportModel from "../models/FraudReport";
import { generateReportPdfBuffer } from "../services/pdfService";

function summarizeEvidence(
  analysis:
    | {
        evidenceSummary?: string;
        evidenceFiles?: Array<{ name: string }>;
      }
    | null,
) {
  if (!analysis) return "";
  const names = analysis.evidenceFiles?.map((file) => file.name).filter(Boolean) || [];
  const fileSummary = names.length > 0 ? `Attached evidence: ${names.join(", ")}.` : "";
  return [analysis.evidenceSummary, fileSummary].filter(Boolean).join(" ");
}

function buildDefaultTitle(
  analysis:
    | {
        channel: string;
        reportDraft?: {
          title?: string;
        };
      }
    | null,
) {
  if (analysis?.reportDraft?.title) return analysis.reportDraft.title;
  if (!analysis) return "Private fraud triage report";
  return `Suspicious ${analysis.channel.toLowerCase()} triage report`;
}

export async function createFraudReportController(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const analysis = req.body.analysisSessionId
    ? await AnalysisSessionModel.findById(req.body.analysisSessionId)
    : null;

  if (analysis?.createdBy && analysis.createdBy !== req.user.userId) {
    return res.status(403).json({ message: "This analysis session belongs to another user." });
  }

  const title = String(req.body.title || buildDefaultTitle(analysis)).trim();
  const description = String(req.body.description || analysis?.reportDraft?.description || analysis?.messageText || "").trim();
  const evidenceDescription = String(
    req.body.evidenceDescription || analysis?.reportDraft?.evidenceDescription || summarizeEvidence(analysis) || "",
  ).trim();
  const fraudType = String(req.body.fraudType || analysis?.reportDraft?.fraudType || analysis?.fraudType || "Suspicious communication").trim();
  const channel = String(req.body.channel || analysis?.reportDraft?.channel || analysis?.channel || "Other").trim();
  const severity = String(req.body.severity || analysis?.reportDraft?.severity || analysis?.severity || "Medium Risk").trim() as
    | "Low Risk"
    | "Medium Risk"
    | "High Risk"
    | "Critical Risk";

  if (!title || !description || !evidenceDescription || !fraudType) {
    return res.status(400).json({ message: "A report needs a title, incident summary, fraud type, and evidence summary." });
  }

  const report = await FraudReportModel.create({
    analysisSessionId: analysis ? String(analysis._id) : undefined,
    title,
    description,
    evidenceDescription,
    fraudType,
    channel,
    amountLost: typeof req.body.amountLost === "number" ? req.body.amountLost : undefined,
    severity,
    legalDisclaimerAccepted: Boolean(req.body.legalDisclaimerAccepted),
    submittedBy: req.user.userId,
    status: "pending",
  });

  res.status(201).json({ id: report._id, status: report.status, analysisSessionId: report.analysisSessionId });
}

export async function getMyReportsController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const reports = await FraudReportModel.find({ submittedBy: req.user.userId }).sort({ createdAt: -1 });
  res.json(reports);
}

export async function downloadReportPdfController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const report = await FraudReportModel.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });

  if (String(report.submittedBy) !== req.user.userId && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const pdfBuffer = await generateReportPdfBuffer(report);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=fraud-report-${report._id}.pdf`);
  res.send(pdfBuffer);
}
