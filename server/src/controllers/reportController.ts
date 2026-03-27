import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import FraudReportModel from "../models/FraudReport";
import { generateReportPdfBuffer } from "../services/pdfService";

export async function createFraudReportController(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const report = await FraudReportModel.create({
    ...req.body,
    submittedBy: req.user.userId,
    status: "pending",
  });

  res.status(201).json({ id: report._id, status: report.status });
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
