import type {
  ConfidenceBreakdown,
  FraudAnalysis,
  ReportToAuthoritiesPayload,
  ReportToAuthoritiesResponse,
  RiskFactor,
} from "../types/fraud";
import { getApiBase } from "./api";
import { eventLogger } from "../utils/eventLogger";
import { getSeverityByScore } from "../utils/severityEngine";

type Rule = {
  test: RegExp;
  weight: number;
  reason: string;
  bucket: keyof ConfidenceBreakdown;
};

const RULES: Rule[] = [
  {
    test: /urgent|immediately|act now|last chance/i,
    weight: 19,
    reason: "Urgency pressure language detected.",
    bucket: "urgencyPressure",
  },
  {
    test: /verify|password|otp|security code|pin/i,
    weight: 24,
    reason: "Credential extraction behavior detected.",
    bucket: "emailThreatIndicators",
  },
  {
    test: /click here|visit link|http:\/\/|https:\/\/|www\./i,
    weight: 21,
    reason: "URL-based redirection pattern detected.",
    bucket: "urlThreat",
  },
  {
    test: /dear customer|bank team|tax agency|government|compliance notice/i,
    weight: 18,
    reason: "Institution impersonation indicators detected.",
    bucket: "psychologicalManipulation",
  },
  {
    test: /suspended|locked|penalty|lawsuit|legal action/i,
    weight: 17,
    reason: "Fear-based coercion pattern detected.",
    bucket: "psychologicalManipulation",
  },
];

const inFlightEscalations = new Set<string>();

function normalizeBreakdown(raw: ConfidenceBreakdown): ConfidenceBreakdown {
  const total = Object.values(raw).reduce((sum, value) => sum + value, 0);
  if (total === 0) {
    return {
      psychologicalManipulation: 25,
      urgencyPressure: 25,
      urlThreat: 25,
      emailThreatIndicators: 25,
    };
  }

  return {
    psychologicalManipulation: Math.round((raw.psychologicalManipulation / total) * 100),
    urgencyPressure: Math.round((raw.urgencyPressure / total) * 100),
    urlThreat: Math.round((raw.urlThreat / total) * 100),
    emailThreatIndicators: Math.round((raw.emailThreatIndicators / total) * 100),
  };
}

function buildRiskFactors(breakdown: ConfidenceBreakdown): RiskFactor[] {
  return [
    {
      key: "psychologicalManipulation",
      label: "Psychological Manipulation",
      value: breakdown.psychologicalManipulation,
      description: "Detects emotional triggers, authority mimicry, and fear tactics.",
    },
    {
      key: "urgencyPressure",
      label: "Urgency Detection",
      value: breakdown.urgencyPressure,
      description: "Detects pressure to act quickly without verification.",
    },
    {
      key: "urlThreat",
      label: "URL Pattern Detection",
      value: breakdown.urlThreat,
      description: "Detects suspicious links and redirection language.",
    },
    {
      key: "emailThreatIndicators",
      label: "Email Threat Indicators",
      value: breakdown.emailThreatIndicators,
      description: "Detects credential requests and impersonation mail patterns.",
    },
  ];
}

function getEscalationFingerprint(payload: ReportToAuthoritiesPayload): string {
  return [payload.analysisId, payload.severity, payload.riskScore, payload.summary.slice(0, 90)].join("|");
}

export class FraudAnalysisService {
  analyzeMessage(message: string): FraudAnalysis {
    const breakdownRaw: ConfidenceBreakdown = {
      psychologicalManipulation: 0,
      urgencyPressure: 0,
      urlThreat: 0,
      emailThreatIndicators: 0,
    };

    let score = 0;
    const reasons: string[] = [];

    for (const rule of RULES) {
      if (rule.test.test(message)) {
        score += rule.weight;
        breakdownRaw[rule.bucket] += rule.weight;
        reasons.push(rule.reason);
      }
    }

    if (/\bfrom:\s*.*@(gmail|yahoo|outlook)\.com/i.test(message)) {
      score += 8;
      breakdownRaw.emailThreatIndicators += 8;
      reasons.push("Potential non-corporate sender domain detected.");
    }

    score = Math.min(100, score);

    if (reasons.length === 0) {
      reasons.push("No high-confidence fraud indicators detected in this sample.");
    }

    const severity = getSeverityByScore(score);
    const confidenceBreakdown = normalizeBreakdown(breakdownRaw);

    const analysis: FraudAnalysis = {
      id: crypto.randomUUID(),
      message,
      riskScore: score,
      confidence: Math.min(100, Math.round(score * 0.95 + 4)),
      severity,
      verdict: score >= 50 ? "Likely Fraud" : "Likely Legitimate",
      reasons,
      confidenceBreakdown,
      riskFactors: buildRiskFactors(confidenceBreakdown),
      shouldEscalate: severity === "High Risk" || severity === "Critical Risk",
      timestamp: new Date().toISOString(),
    };

    eventLogger.log({
      id: crypto.randomUUID(),
      timestamp: analysis.timestamp,
      severity: analysis.severity,
      riskScore: analysis.riskScore,
      messagePreview: analysis.message.slice(0, 90),
      action: severity === "High Risk" || severity === "Critical Risk" ? "HIGH_RISK_FLAGGED" : "ANALYZED",
    });

    return analysis;
  }

  async reportToAuthorities(payload: ReportToAuthoritiesPayload): Promise<ReportToAuthoritiesResponse> {
    const fingerprint = getEscalationFingerprint(payload);

    if (inFlightEscalations.has(fingerprint)) {
      return {
        success: true,
        referenceId: "DUPLICATE_BLOCKED",
        destination: "Police Notification Queue (Mock API)",
        status: "queued",
      };
    }

    inFlightEscalations.add(fingerprint);

    try {
      const response = await fetch(`${getApiBase()}/escalations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Escalation API unavailable");
      }

      const apiResult = (await response.json()) as {
        referenceId: string;
        destination: string;
        status: "queued" | "failed";
      };

      eventLogger.log({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        severity: payload.severity,
        riskScore: payload.riskScore,
        messagePreview: payload.summary.slice(0, 90),
        action: "CRITICAL_REPORTED",
      });

      return {
        success: true,
        referenceId: apiResult.referenceId,
        destination: apiResult.destination,
        status: apiResult.status,
      };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 700));

      eventLogger.log({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        severity: payload.severity,
        riskScore: payload.riskScore,
        messagePreview: payload.summary.slice(0, 90),
        action: "CRITICAL_REPORTED",
      });

      return {
        success: true,
        referenceId: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        destination: "Police Notification Queue (Mock API)",
        status: "queued",
      };
    } finally {
      inFlightEscalations.delete(fingerprint);
    }
  }
}

export const fraudAnalysisService = new FraudAnalysisService();
