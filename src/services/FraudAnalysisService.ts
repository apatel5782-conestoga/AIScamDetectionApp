import type { FraudAnalysis, FraudChannel, EvidenceFileMeta } from "../types/fraud";
import { apiRequest, getApiBase } from "./api";

const LAST_ANALYSIS_KEY = "last_fraud_triage_analysis";

type AnalysisApiResponse = {
  id: string;
  messageText: string;
  channel: FraudChannel;
  evidenceSummary?: string;
  evidenceFiles: EvidenceFileMeta[];
  scamCategory: string;
  triageSummary: string;
  extractedSignals: string[];
  fraudType: string;
  riskScore: number;
  confidence: number;
  severity: FraudAnalysis["severity"];
  verdict: FraudAnalysis["verdict"];
  reasons: string[];
  confidenceBreakdown: FraudAnalysis["confidenceBreakdown"];
  riskFactors: FraudAnalysis["riskFactors"];
  similarCases: FraudAnalysis["similarCases"];
  recommendedActions: FraudAnalysis["recommendedActions"];
  reportDraft: FraudAnalysis["reportDraft"];
  caseTimeline: FraudAnalysis["caseTimeline"];
  safeUseNotice: string;
  createdAt: string;
};

export type CreateAnalysisPayload = {
  message: string;
  channel: FraudChannel;
  evidenceSummary?: string;
  evidenceFiles: EvidenceFileMeta[];
  actualFiles?: File[];
  authToken?: string | null;
};

function mapAnalysis(response: AnalysisApiResponse): FraudAnalysis {
  return {
    id: response.id,
    message: response.messageText,
    channel: response.channel,
    evidenceSummary: response.evidenceSummary,
    evidenceFiles: response.evidenceFiles,
    scamCategory: response.scamCategory,
    triageSummary: response.triageSummary,
    extractedSignals: response.extractedSignals,
    fraudType: response.fraudType,
    riskScore: response.riskScore,
    confidence: response.confidence,
    severity: response.severity,
    verdict: response.verdict,
    reasons: response.reasons,
    confidenceBreakdown: response.confidenceBreakdown,
    riskFactors: response.riskFactors,
    similarCases: response.similarCases,
    recommendedActions: response.recommendedActions,
    reportDraft: response.reportDraft,
    caseTimeline: response.caseTimeline,
    safeUseNotice: response.safeUseNotice,
    shouldEscalate: response.severity === "High Risk" || response.severity === "Critical Risk",
    timestamp: response.createdAt,
  };
}

async function createAnalysis(payload: CreateAnalysisPayload): Promise<FraudAnalysis> {
  const apiBase = getApiBase();
  const url = `${apiBase}/analyses`;

  const hasActualFiles = payload.actualFiles && payload.actualFiles.length > 0;

  let fetchResponse: Response;

  if (hasActualFiles) {
    // Use FormData to send actual files for AI extraction
    const formData = new FormData();
    formData.append("messageText", payload.message);
    formData.append("channel", payload.channel);
    if (payload.evidenceSummary?.trim()) {
      formData.append("evidenceSummary", payload.evidenceSummary.trim());
    }
    for (const file of payload.actualFiles!) {
      formData.append("files", file);
    }

    fetchResponse = await fetch(url, {
      method: "POST",
      headers: payload.authToken ? { Authorization: `Bearer ${payload.authToken}` } : {},
      body: formData,
    });
  } else {
    // JSON submission (no files)
    const body = {
      messageText: payload.message,
      channel: payload.channel,
      evidenceFiles: payload.evidenceFiles,
      ...(payload.evidenceSummary?.trim() ? { evidenceSummary: payload.evidenceSummary.trim() } : {}),
    };

    fetchResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(payload.authToken ? { Authorization: `Bearer ${payload.authToken}` } : {}),
      },
      body: JSON.stringify(body),
    });
  }

  if (!fetchResponse.ok) {
    const contentType = fetchResponse.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const errorData = (await fetchResponse.json()) as { message?: string; errors?: Array<{ msg?: string }> };
      if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        throw new Error(errorData.errors.map((e) => e.msg).join(" | "));
      }
      throw new Error(errorData.message || `Request failed: ${fetchResponse.status}`);
    }
    throw new Error(`Request failed: ${fetchResponse.status}`);
  }

  const response = (await fetchResponse.json()) as AnalysisApiResponse;
  const analysis = mapAnalysis(response);
  localStorage.setItem(LAST_ANALYSIS_KEY, JSON.stringify(analysis));
  return analysis;
}

async function getMyAnalyses(authToken: string): Promise<FraudAnalysis[]> {
  const response = await apiRequest<AnalysisApiResponse[]>("/analyses/mine", {
    method: "GET",
    authToken,
  });
  return response.map(mapAnalysis);
}

function saveLatestAnalysis(analysis: FraudAnalysis) {
  localStorage.setItem(LAST_ANALYSIS_KEY, JSON.stringify(analysis));
}

function loadLatestAnalysis(): FraudAnalysis | null {
  const raw = localStorage.getItem(LAST_ANALYSIS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FraudAnalysis;
  } catch {
    return null;
  }
}

function clearLatestAnalysis() {
  localStorage.removeItem(LAST_ANALYSIS_KEY);
}

export const fraudAnalysisService = {
  createAnalysis,
  getMyAnalyses,
  saveLatestAnalysis,
  loadLatestAnalysis,
  clearLatestAnalysis,
};
