import type { FraudReport, FraudReportStatus } from "../models/FraudReport";
import { apiRequest } from "./api";

export type AdminAnalytics = {
  totalReports: number;
  pending: number;
  underReview: number;
  escalated: number;
  closed: number;
  critical: number;
  analyses: number;
  logs: Array<{
    _id?: string;
    type: string;
    message: string;
    createdAt?: string;
  }>;
};

export async function fetchAdminReports(token: string): Promise<FraudReport[]> {
  return apiRequest<FraudReport[]>("/admin/reports", {
    method: "GET",
    authToken: token,
  });
}

export async function fetchAdminAnalytics(token: string): Promise<AdminAnalytics> {
  return apiRequest<AdminAnalytics>("/admin/analytics", {
    method: "GET",
    authToken: token,
  });
}

export async function updateAdminReportStatus(
  token: string,
  reportId: string,
  payload: { status: FraudReportStatus; adminNotes?: string },
): Promise<FraudReport> {
  return apiRequest<FraudReport>(`/admin/reports/${reportId}/status`, {
    method: "PATCH",
    authToken: token,
    body: JSON.stringify(payload),
  });
}
