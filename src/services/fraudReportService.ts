import type { FraudReport, FraudReportDraft, FraudReportStatus } from "../models/FraudReport";
import { getApiBase, apiRequest } from "./api";

export async function submitFraudReport(
  token: string,
  payload: FraudReportDraft,
): Promise<{ id: string; status: FraudReportStatus; analysisSessionId?: string }> {
  const requestBody = {
    legalDisclaimerAccepted: payload.legalDisclaimerAccepted,
    ...(payload.analysisSessionId ? { analysisSessionId: payload.analysisSessionId } : {}),
    ...(payload.title?.trim() ? { title: payload.title.trim() } : {}),
    ...(payload.description?.trim() ? { description: payload.description.trim() } : {}),
    ...(payload.evidenceDescription?.trim() ? { evidenceDescription: payload.evidenceDescription.trim() } : {}),
    ...(payload.fraudType?.trim() ? { fraudType: payload.fraudType.trim() } : {}),
    ...(payload.channel ? { channel: payload.channel } : {}),
    ...(payload.severity ? { severity: payload.severity } : {}),
    ...(typeof payload.amountLost === "number" ? { amountLost: payload.amountLost } : {}),
  };

  return apiRequest<{ id: string; status: FraudReportStatus; analysisSessionId?: string }>("/reports", {
    method: "POST",
    authToken: token,
    body: JSON.stringify(requestBody),
  });
}

export async function getMyFraudReports(token: string): Promise<FraudReport[]> {
  return apiRequest<FraudReport[]>("/reports/mine", {
    method: "GET",
    authToken: token,
  });
}

export async function generateFraudReportPdf(reportId: string, token: string): Promise<Blob> {
  const response = await fetch(`${getApiBase()}/reports/${reportId}/pdf`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  return response.blob();
}
