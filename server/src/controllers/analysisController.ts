import type { Request, Response } from "express";
import AnalysisSessionModel, { type IAnalysisSession } from "../models/AnalysisSession";
import SystemLogModel from "../models/SystemLog";
import { analyzeSubmission } from "../services/analysisService";
import { extractTextFromFiles } from "../services/fileExtractionService";
import { analyzeUrlsInText } from "../services/urlAnalysisService";

function serializeAnalysis(session: IAnalysisSession & { _id: unknown }) {
  return {
    id: String(session._id),
    messageText: session.messageText,
    channel: session.channel,
    evidenceSummary: session.evidenceSummary,
    evidenceFiles: session.evidenceFiles,
    scamCategory: session.scamCategory,
    triageSummary: session.triageSummary,
    extractedSignals: session.extractedSignals,
    fraudType: session.fraudType,
    riskScore: session.riskScore,
    confidence: session.confidence,
    severity: session.severity,
    verdict: session.verdict,
    reasons: session.reasons,
    confidenceBreakdown: session.confidenceBreakdown,
    riskFactors: session.riskFactors,
    similarCases: session.similarCases,
    recommendedActions: session.recommendedActions,
    reportDraft: session.reportDraft,
    caseTimeline: session.caseTimeline,
    safeUseNotice: session.safeUseNotice,
    createdAt: session.createdAt?.toISOString(),
  };
}

export async function createAnalysisSessionController(req: Request, res: Response) {
  const messageText = String(req.body?.messageText || "").trim();
  const channel = String(req.body?.channel || "Other");
  const evidenceSummary = req.body?.evidenceSummary ? String(req.body.evidenceSummary).trim() : undefined;

  if (!messageText || messageText.length < 10) {
    return res.status(400).json({ errors: [{ msg: "messageText must be at least 10 characters." }] });
  }

  const validChannels = ["Email", "SMS", "Phone", "Social Media", "Website", "Other"];
  if (!validChannels.includes(channel)) {
    return res.status(400).json({ errors: [{ msg: "Invalid channel." }] });
  }

  // Handle uploaded files (from multer)
  const uploadedFiles = (req.files as Express.Multer.File[]) || [];

  let extractedFileContent: string | undefined;
  let evidenceFiles: Array<{ name: string; size: number; type: string }> = [];

  if (uploadedFiles.length > 0) {
    extractedFileContent = await extractTextFromFiles(
      uploadedFiles.map((f) => ({
        buffer: f.buffer,
        mimetype: f.mimetype,
        originalname: f.originalname,
      })),
    );
    evidenceFiles = uploadedFiles.map((f) => ({
      name: f.originalname,
      size: f.size,
      type: f.mimetype || "application/octet-stream",
    }));
  } else if (Array.isArray(req.body?.evidenceFiles)) {
    // Fallback: JSON metadata only (no actual files)
    evidenceFiles = req.body.evidenceFiles.map((file: Record<string, unknown>) => ({
      name: String(file.name || "evidence"),
      size: Number(file.size || 0),
      type: String(file.type || "application/octet-stream"),
    }));
  }

  // Check any URLs found in the message
  const urlAnalysis = await analyzeUrlsInText(messageText).catch(() => ({ urls: [], summary: "" }));
  const urlContext = urlAnalysis.summary
    ? `\n\nURL Analysis Results:\n${urlAnalysis.summary}`
    : "";

  const analysisPayload = await analyzeSubmission({
    createdBy: req.user?.userId,
    messageText,
    channel: channel as IAnalysisSession["channel"],
    evidenceSummary,
    evidenceFiles,
    extractedFileContent: (extractedFileContent || "") + urlContext || undefined,
  });

  const analysis = await AnalysisSessionModel.create(analysisPayload);

  await SystemLogModel.create({
    type: "ANALYSIS_CREATED",
    message: `Analysis session created with severity ${analysis.severity}`,
    metadata: { analysisId: analysis._id, createdBy: req.user?.userId || "guest" },
  });

  return res.status(201).json(serializeAnalysis(analysis));
}

export async function listMyAnalysisSessionsController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const analyses = await AnalysisSessionModel.find({ createdBy: req.user.userId })
    .sort({ createdAt: -1 })
    .limit(50);

  return res.json(analyses.map((session) => serializeAnalysis(session)));
}
