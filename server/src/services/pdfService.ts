import PDFDocument from "pdfkit";
import type { IFraudReport } from "../models/FraudReport";

export function generateReportPdfBuffer(report: IFraudReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    document.on("data", (chunk) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    document.fontSize(18).text("AI-Assisted Fraud Triage and Reporting", { underline: true });
    document.moveDown();
    document.fontSize(12).text(`Report ID: ${String(report._id)}`);
    document.text(`Title: ${report.title}`);
    document.text(`Fraud Type: ${report.fraudType}`);
    document.text(`Severity: ${report.severity}`);
    document.text(`Channel: ${report.channel}`);
    document.text(`Status: ${report.status}`);
    if (report.analysisSessionId) document.text(`Analysis Session: ${report.analysisSessionId}`);
    if (report.reviewedAt) document.text(`Last Reviewed: ${report.reviewedAt.toISOString()}`);
    document.moveDown();
    document.text("Description:");
    document.text(report.description);
    document.moveDown();
    document.text("Evidence Description:");
    document.text(report.evidenceDescription);
    if (report.adminNotes) {
      document.moveDown();
      document.text("Admin Notes:");
      document.text(report.adminNotes);
    }
    document.moveDown();
    document.fontSize(10).text("Academic demonstration only. This report is private and not for public accusation.");

    document.end();
  });
}
