import type { FraudAnalysis, FraudChannel, EvidenceFileMeta } from "../types/fraud";
import { apiRequest } from "./api";

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
  const body = {
    messageText: payload.message,
    channel: payload.channel,
    evidenceFiles: payload.evidenceFiles,
    ...(payload.evidenceSummary?.trim() ? { evidenceSummary: payload.evidenceSummary.trim() } : {}),
  };

  const response = await apiRequest<AnalysisApiResponse>("/analyses", {
    method: "POST",
    authToken: payload.authToken,
    body: JSON.stringify(body),
  });

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
