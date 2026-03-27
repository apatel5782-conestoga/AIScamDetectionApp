import type { Request, Response } from "express";
import FraudReportModel from "../models/FraudReport";
import SystemLogModel from "../models/SystemLog";

export async function listAllReportsController(_req: Request, res: Response) {
  const reports = await FraudReportModel.find().sort({ createdAt: -1 }).limit(200);
  res.json(reports);
}

export async function updateReportStatusController(req: Request, res: Response) {
  const { status } = req.body as { status: "pending" | "approved" | "rejected" };
  const report = await FraudReportModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!report) return res.status(404).json({ message: "Report not found" });

  await SystemLogModel.create({
    type: "ADMIN_REVIEW",
    message: `Report ${report._id} status changed to ${status}`,
    metadata: { reportId: report._id },
  });

  res.json(report);
}

export async function adminAnalyticsController(_req: Request, res: Response) {
  const totalReports = await FraudReportModel.countDocuments();
  const pending = await FraudReportModel.countDocuments({ status: "pending" });
  const critical = await FraudReportModel.countDocuments({ severity: "Critical Risk" });
  const logs = await SystemLogModel.find().sort({ createdAt: -1 }).limit(20);

  res.json({ totalReports, pending, critical, logs });
}
