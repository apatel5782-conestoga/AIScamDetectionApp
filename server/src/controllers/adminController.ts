import type { Request, Response } from "express";
import AnalysisSessionModel from "../models/AnalysisSession";
import FraudReportModel from "../models/FraudReport";
import SystemLogModel from "../models/SystemLog";

export async function listAllReportsController(_req: Request, res: Response) {
  const reports = await FraudReportModel.find().sort({ createdAt: -1 }).limit(200);
  res.json(reports);
}

export async function updateReportStatusController(req: Request, res: Response) {
  const { status, adminNotes } = req.body as {
    status: "pending" | "under_review" | "needs_more_info" | "escalated" | "closed";
    adminNotes?: string;
  };
  const report = await FraudReportModel.findByIdAndUpdate(
    req.params.id,
    {
      status,
      adminNotes,
      reviewedBy: req.user?.userId,
      reviewedAt: new Date(),
    },
    { returnDocument: "after" },
  );
  if (!report) return res.status(404).json({ message: "Report not found" });

  await SystemLogModel.create({
    type: "ADMIN_REVIEW",
    message: `Report ${report._id} status changed to ${status}`,
    metadata: { reportId: report._id, adminNotes },
  });

  res.json(report);
}

export async function adminAnalyticsController(_req: Request, res: Response) {
  const totalReports = await FraudReportModel.countDocuments();
  const pending = await FraudReportModel.countDocuments({ status: "pending" });
  const underReview = await FraudReportModel.countDocuments({ status: "under_review" });
  const escalated = await FraudReportModel.countDocuments({ status: "escalated" });
  const closed = await FraudReportModel.countDocuments({ status: "closed" });
  const critical = await FraudReportModel.countDocuments({ severity: "Critical Risk" });
  const analyses = await AnalysisSessionModel.countDocuments();
  const logs = await SystemLogModel.find().sort({ createdAt: -1 }).limit(20);

  res.json({
    totalReports,
    pending,
    underReview,
    escalated,
    closed,
    critical,
    analyses,
    logs,
  });
}
