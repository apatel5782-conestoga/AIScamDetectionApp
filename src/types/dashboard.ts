import type { FraudReport } from "../models/FraudReport";
import type { FraudAnalysis } from "./fraud";

export type DashboardMetric = {
  label: string;
  value: number;
  helperText: string;
};

export type DashboardTrendPoint = {
  month: string;
  value: number;
};

export type DashboardData = {
  metrics: DashboardMetric[];
  recentAnalyses: FraudAnalysis[];
  recentReports: FraudReport[];
};
