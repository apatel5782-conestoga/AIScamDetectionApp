import PDFDocument from "pdfkit";
import type { IFraudReport } from "../models/FraudReport";

export function generateReportPdfBuffer(report: IFraudReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    document.on("data", (chunk) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    document.fontSize(18).text("AI Fraud Intelligence & Protection System", { underline: true });
    document.moveDown();
    document.fontSize(12).text(`Report ID: ${String(report._id)}`);
    document.text(`Title: ${report.title}`);
    document.text(`Fraud Type: ${report.fraudType}`);
    document.text(`Severity: ${report.severity}`);
    document.text(`Channel: ${report.channel}`);
    document.text(`Status: ${report.status}`);
    document.moveDown();
    document.text("Description:");
    document.text(report.description);
    document.moveDown();
    document.text("Evidence Description:");
    document.text(report.evidenceDescription);
    document.moveDown();
    document.fontSize(10).text("Academic demonstration only. This report is private and not for public accusation.");

    document.end();
  });
}
