import type { FraudReport } from "../models/FraudReport";
import type { FraudAnalysis } from "../types/fraud";
import type { DashboardData } from "../types/dashboard";
import { fraudAnalysisService } from "./FraudAnalysisService";
import { getMyFraudReports } from "./fraudReportService";

function filterHighRiskAnalyses(analyses: FraudAnalysis[]) {
  return analyses.filter((analysis) => analysis.severity === "High Risk" || analysis.severity === "Critical Risk");
}

function filterOpenReports(reports: FraudReport[]) {
  return reports.filter((report) => report.status !== "closed");
}

export async function fetchDashboardData(token: string): Promise<DashboardData> {
  const [analyses, reports] = await Promise.all([
    fraudAnalysisService.getMyAnalyses(token),
    getMyFraudReports(token),
  ]);

  return {
    metrics: [
      { label: "Saved analyses", value: analyses.length, helperText: "Triage sessions stored to your account" },
      { label: "High-risk findings", value: filterHighRiskAnalyses(analyses).length, helperText: "Analyses that need urgent review" },
      { label: "Submitted reports", value: reports.length, helperText: "Private reports created from your triage work" },
      { label: "Open cases", value: filterOpenReports(reports).length, helperText: "Reports still awaiting resolution" },
    ],
    recentAnalyses: analyses.slice(0, 5),
    recentReports: reports.slice(0, 5),
  };
}
