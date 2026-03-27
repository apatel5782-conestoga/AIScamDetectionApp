import type { Request, Response } from "express";
import crypto from "crypto";
import SystemLogModel from "../models/SystemLog";

export async function createEscalationEventController(req: Request, res: Response) {
  const { analysisId, summary, riskScore, severity } = req.body as {
    analysisId: string;
    summary: string;
    riskScore: number;
    severity: string;
  };

  if (!analysisId || !summary || typeof riskScore !== "number" || !severity) {
    return res.status(400).json({ message: "Invalid escalation payload" });
  }

  const dedupeKey = crypto
    .createHash("sha256")
    .update(`${analysisId}|${severity}|${riskScore}|${summary.slice(0, 120)}`)
    .digest("hex");

  const windowStart = new Date(Date.now() - 15000);

  const existing = await SystemLogModel.findOne({
    type: "ESCALATION_EVENT",
    dedupeKey,
    createdAt: { $gte: windowStart },
  }).lean();

  if (existing) {
    return res.json({
      success: true,
      referenceId: `POL-${String(existing._id).slice(-6).toUpperCase()}`,
      destination: "Police Notification Queue (Mock API)",
      status: "queued",
      duplicate: true,
    });
  }

  const log = await SystemLogModel.create({
    type: "ESCALATION_EVENT",
    message: "Critical escalation submitted to authorities queue",
    dedupeKey,
    metadata: {
      analysisId,
      severity,
      riskScore,
      summaryPreview: summary.slice(0, 140),
      source: "frontend",
    },
  });

  return res.status(201).json({
    success: true,
    referenceId: `POL-${String(log._id).slice(-6).toUpperCase()}`,
    destination: "Police Notification Queue (Mock API)",
    status: "queued",
    duplicate: false,
  });
}
