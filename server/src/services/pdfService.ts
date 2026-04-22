import PDFDocument from "pdfkit";
import type { IFraudReport } from "../models/FraudReport";
import AnalysisSessionModel from "../models/AnalysisSession";

function severityColor(severity: string): string {
  switch (severity) {
    case "Critical Risk": return "#DC2626";
    case "High Risk": return "#EA580C";
    case "Medium Risk": return "#D97706";
    default: return "#16A34A";
  }
}

export async function generateReportPdfBuffer(report: IFraudReport): Promise<Buffer> {
  // Fetch linked analysis session if available
  const analysis = report.analysisSessionId
    ? await AnalysisSessionModel.findById(report.analysisSessionId)
    : null;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - 100;

    // ── Header ──────────────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 80).fill("#1E3A5F");
    doc.fillColor("white").fontSize(20).font("Helvetica-Bold")
      .text("AI SCAM DETECTION", 50, 20, { width: pageWidth });
    doc.fontSize(10).font("Helvetica")
      .text("Fraud Triage Report — Confidential & Private", 50, 46, { width: pageWidth });
    doc.moveDown(3);

    // ── Report Meta ──────────────────────────────────────────────────────────
    doc.fillColor("#111827").fontSize(16).font("Helvetica-Bold")
      .text(report.title, 50, 100, { width: pageWidth });

    doc.moveDown(0.5);
    doc.fontSize(9).font("Helvetica").fillColor("#6B7280");
    doc.text(`Report ID: ${String(report._id)}`, { continued: true });
    doc.text(`   |   Generated: ${new Date().toLocaleString()}`, { continued: true });
    if (report.reviewedAt) doc.text(`   |   Last Reviewed: ${report.reviewedAt.toLocaleString()}`);
    else doc.text("");

    doc.moveDown(1);

    // ── Status Bar ───────────────────────────────────────────────────────────
    doc.rect(50, doc.y, pageWidth, 36).fill("#F3F4F6");
    const barY = doc.y - 32;
    doc.fillColor("#374151").fontSize(10).font("Helvetica-Bold")
      .text("Status:", 60, barY + 11, { continued: true });
    doc.font("Helvetica").fillColor("#1D4ED8")
      .text(` ${report.status.replace(/_/g, " ").toUpperCase()}`, { continued: true });
    doc.fillColor("#374151").text("    Severity:", { continued: true });
    doc.fillColor(severityColor(report.severity)).text(` ${report.severity}`, { continued: true });
    doc.fillColor("#374151").text("    Channel:", { continued: true });
    doc.text(` ${report.channel}`);
    doc.moveDown(2);

    // ── AI Risk Score ────────────────────────────────────────────────────────
    if (analysis) {
      doc.fillColor("#111827").fontSize(13).font("Helvetica-Bold").text("AI Risk Assessment", 50);
      doc.moveDown(0.3);

      const scoreX = 50;
      const scoreY = doc.y;
      doc.rect(scoreX, scoreY, 110, 60).fill(severityColor(analysis.severity) + "22");
      doc.rect(scoreX, scoreY, 110, 60).stroke(severityColor(analysis.severity));
      doc.fillColor(severityColor(analysis.severity)).fontSize(28).font("Helvetica-Bold")
        .text(`${analysis.riskScore}`, scoreX + 10, scoreY + 8, { width: 90, align: "center" });
      doc.fontSize(9).font("Helvetica")
        .text("RISK SCORE / 100", scoreX + 5, scoreY + 42, { width: 100, align: "center" });

      const verdictX = scoreX + 125;
      doc.fillColor("#111827").fontSize(12).font("Helvetica-Bold")
        .text(analysis.verdict, verdictX, scoreY + 5);
      doc.fillColor("#374151").fontSize(9).font("Helvetica")
        .text(analysis.severity, verdictX, scoreY + 23);
      doc.fillColor("#6B7280").fontSize(9)
        .text(`Category: ${analysis.scamCategory}`, verdictX, scoreY + 38);

      doc.y = scoreY + 75;
      doc.moveDown(0.5);

      // Triage Summary
      doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("AI Analysis Summary");
      doc.moveDown(0.2);
      doc.fillColor("#374151").fontSize(10).font("Helvetica")
        .text(analysis.triageSummary || "", { width: pageWidth });
      doc.moveDown(1);

      // Detected Signals
      if (analysis.extractedSignals?.length > 0) {
        doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Detected Signals");
        doc.moveDown(0.2);
        for (const signal of analysis.extractedSignals) {
          doc.fillColor("#DC2626").fontSize(10).font("Helvetica")
            .text(`• ${signal}`, 60, doc.y, { width: pageWidth - 10 });
        }
        doc.moveDown(1);
      }

      // Risk Factors Breakdown
      if (analysis.confidenceBreakdown) {
        doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Risk Factor Breakdown");
        doc.moveDown(0.2);
        const factors = [
          { label: "Psychological Manipulation", value: analysis.confidenceBreakdown.psychologicalManipulation },
          { label: "Urgency Pressure", value: analysis.confidenceBreakdown.urgencyPressure },
          { label: "Link / URL Threat", value: analysis.confidenceBreakdown.urlThreat },
          { label: "Credential Theft Risk", value: analysis.confidenceBreakdown.emailThreatIndicators },
        ];
        for (const factor of factors) {
          const barY2 = doc.y;
          doc.fillColor("#374151").fontSize(9).font("Helvetica").text(`${factor.label}`, 60, barY2);
          doc.fillColor("#6B7280").text(`${factor.value}%`, 60 + pageWidth - 30, barY2, { width: 30, align: "right" });
          doc.rect(60, barY2 + 13, pageWidth - 50, 6).fill("#E5E7EB");
          doc.rect(60, barY2 + 13, Math.max(4, (pageWidth - 50) * factor.value / 100), 6)
            .fill(factor.value > 60 ? "#DC2626" : factor.value > 30 ? "#D97706" : "#16A34A");
          doc.y = barY2 + 26;
        }
        doc.moveDown(1);
      }

      // Reasons
      if (analysis.reasons?.length > 0) {
        doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Analysis Reasoning");
        doc.moveDown(0.2);
        for (const reason of analysis.reasons) {
          doc.fillColor("#374151").fontSize(9).font("Helvetica")
            .text(`• ${reason}`, 60, doc.y, { width: pageWidth - 10 });
        }
        doc.moveDown(1);
      }

      // Recommended Actions
      if (analysis.recommendedActions?.length > 0) {
        doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Recommended Actions");
        doc.moveDown(0.2);
        for (const action of analysis.recommendedActions) {
          const priority = action.priority === "now" ? "[IMMEDIATE]" : "[SOON]";
          doc.fillColor(action.priority === "now" ? "#DC2626" : "#D97706").fontSize(9).font("Helvetica-Bold")
            .text(priority, 60, doc.y, { continued: true });
          doc.fillColor("#111827").font("Helvetica-Bold").text(` ${action.title}`);
          doc.fillColor("#374151").font("Helvetica").fontSize(8)
            .text(action.description, 70, doc.y, { width: pageWidth - 20 });
          doc.moveDown(0.5);
        }
        doc.moveDown(0.5);
      }
    }

    // ── Incident Details ─────────────────────────────────────────────────────
    doc.addPage();
    doc.fillColor("#111827").fontSize(13).font("Helvetica-Bold").text("Incident Details", 50, 50);
    doc.moveDown(0.5);

    doc.fillColor("#374151").fontSize(10).font("Helvetica-Bold").text("Description:", { width: pageWidth });
    doc.font("Helvetica").fillColor("#374151").fontSize(10).text(report.description, { width: pageWidth });
    doc.moveDown(1);

    doc.fillColor("#374151").fontSize(10).font("Helvetica-Bold").text("Evidence Summary:", { width: pageWidth });
    doc.font("Helvetica").fillColor("#374151").fontSize(10).text(report.evidenceDescription, { width: pageWidth });
    doc.moveDown(1);

    if (report.amountLost) {
      doc.fillColor("#374151").fontSize(10).font("Helvetica-Bold")
        .text(`Reported Amount Lost: $${report.amountLost.toLocaleString()}`, { width: pageWidth });
      doc.moveDown(1);
    }

    // Original message
    if (analysis?.messageText) {
      doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Original Submitted Content");
      doc.moveDown(0.2);
      doc.rect(50, doc.y, pageWidth, 1).fill("#E5E7EB");
      doc.moveDown(0.2);
      doc.fillColor("#374151").fontSize(9).font("Helvetica")
        .text(analysis.messageText.slice(0, 1200), 50, doc.y, {
          width: pageWidth,
          lineGap: 2,
        });
      doc.moveDown(1);
    }

    // Evidence files listed
    if (analysis?.evidenceFiles?.length) {
      doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Submitted Evidence Files");
      doc.moveDown(0.2);
      for (const file of analysis.evidenceFiles) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        doc.fillColor("#374151").fontSize(9).font("Helvetica")
          .text(`• ${file.name} (${file.type}, ${sizeMb} MB)`, 60);
      }
      doc.moveDown(1);
    }

    // Case Timeline
    if (analysis?.caseTimeline?.length) {
      doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Case Timeline");
      doc.moveDown(0.2);
      for (let i = 0; i < analysis.caseTimeline.length; i++) {
        const event = analysis.caseTimeline[i];
        doc.fillColor("#1D4ED8").fontSize(9).font("Helvetica-Bold")
          .text(`${i + 1}. ${event.title}`, 60);
        doc.fillColor("#6B7280").font("Helvetica").fontSize(8)
          .text(event.description, 70, doc.y, { width: pageWidth - 20 });
        doc.moveDown(0.4);
      }
      doc.moveDown(0.5);
    }

    // Admin Notes
    if (report.adminNotes) {
      doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Admin Review Notes");
      doc.moveDown(0.2);
      doc.fillColor("#374151").fontSize(10).font("Helvetica").text(report.adminNotes, { width: pageWidth });
      doc.moveDown(1);
    }

    // ── Footer ───────────────────────────────────────────────────────────────
    const footerY = doc.page.height - 60;
    doc.rect(0, footerY, doc.page.width, 60).fill("#F3F4F6");
    doc.fillColor("#9CA3AF").fontSize(8).font("Helvetica")
      .text(
        "CONFIDENTIAL — Academic demonstration only. This report is for private triage and decision support purposes only. It does not constitute legal or forensic evidence.",
        50, footerY + 10,
        { width: doc.page.width - 100, align: "center" }
      );
    doc.text(`Report ID: ${String(report._id)}   |   Fraud Type: ${report.fraudType}   |   Generated by AI Scam Detection`, 50, footerY + 28, { width: doc.page.width - 100, align: "center" });

    doc.end();
  });
}
