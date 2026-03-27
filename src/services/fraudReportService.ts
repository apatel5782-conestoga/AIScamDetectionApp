import type { FraudReport } from "../models/FraudReport";
import { apiRequest } from "./api";

export async function submitFraudReport(payload: FraudReport): Promise<{ id: string }> {
  return apiRequest<{ id: string }>("/reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function generateFraudReportPdf(reportId: string): Promise<Blob> {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const response = await fetch(`${API_BASE}/reports/${reportId}/pdf`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  return response.blob();
}
