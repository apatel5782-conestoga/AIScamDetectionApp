import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import AnalysisSessionModel, { type IAnalysisSession } from "../models/AnalysisSession";
import SystemLogModel from "../models/SystemLog";
import { analyzeSubmission } from "../services/analysisService";

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const evidenceFiles = Array.isArray(req.body.evidenceFiles)
    ? req.body.evidenceFiles.map((file: Record<string, unknown>) => ({
        name: String(file.name || "evidence"),
        size: Number(file.size || 0),
        type: String(file.type || "application/octet-stream"),
      }))
    : [];

  const analysisPayload = await analyzeSubmission({
      createdBy: req.user?.userId,
      messageText: String(req.body.messageText || ""),
      channel: req.body.channel,
      evidenceSummary: req.body.evidenceSummary ? String(req.body.evidenceSummary) : undefined,
      evidenceFiles,
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
