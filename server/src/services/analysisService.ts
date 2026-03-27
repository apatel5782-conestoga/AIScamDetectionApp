import type {
  ICaseTimelineEvent,
  IAnalysisSession,
  IConfidenceBreakdown,
  IEvidenceFile,
  IGeneratedReportDraft,
  IRiskFactor,
  IRecommendedAction,
  ISimilarCase,
} from "../models/AnalysisSession";
import AnalysisSessionModel from "../models/AnalysisSession";

type AnalysisInput = {
  createdBy?: string;
  messageText: string;
  channel: IAnalysisSession["channel"];
  evidenceSummary?: string;
  evidenceFiles: IEvidenceFile[];
};

type Rule = {
  test: RegExp;
  weight: number;
  reason: string;
  bucket: keyof IConfidenceBreakdown;
  signal: string;
};

const RULES: Rule[] = [
  {
    test: /urgent|immediately|act now|last chance|final notice/i,
    weight: 19,
    reason: "Urgency pressure language suggests a scammer is trying to force quick action.",
    bucket: "urgencyPressure",
    signal: "urgency language",
  },
  {
    test: /verify|password|otp|security code|pin|passcode/i,
    weight: 24,
    reason: "The message asks for credentials or verification data that should not be shared.",
    bucket: "emailThreatIndicators",
    signal: "credential request",
  },
  {
    test: /click here|visit link|http:\/\/|https:\/\/|www\./i,
    weight: 21,
    reason: "A link or redirect pattern appears in the message and should be independently verified.",
    bucket: "urlThreat",
    signal: "suspicious link",
  },
  {
    test: /dear customer|bank team|tax agency|government|compliance notice|payroll/i,
    weight: 18,
    reason: "The wording imitates an institution or authority to build false trust.",
    bucket: "psychologicalManipulation",
    signal: "authority impersonation",
  },
  {
    test: /suspended|locked|penalty|lawsuit|legal action|arrest/i,
    weight: 17,
    reason: "Fear-based pressure is present, which is common in fraud attempts.",
    bucket: "psychologicalManipulation",
    signal: "fear pressure",
  },
];

function getSeverityByScore(score: number): IAnalysisSession["severity"] {
  if (score >= 86) return "Critical Risk";
  if (score >= 71) return "High Risk";
  if (score >= 41) return "Medium Risk";
  return "Low Risk";
}

function normalizeBreakdown(raw: IConfidenceBreakdown): IConfidenceBreakdown {
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

function buildRiskFactors(breakdown: IConfidenceBreakdown): IRiskFactor[] {
  return [
    {
      key: "psychologicalManipulation",
      label: "Psychological manipulation",
      value: breakdown.psychologicalManipulation,
      description: "Authority mimicry, fear language, and emotional pressure.",
    },
    {
      key: "urgencyPressure",
      label: "Urgency pressure",
      value: breakdown.urgencyPressure,
      description: "Signals that pressure the user to act quickly without verification.",
    },
    {
      key: "urlThreat",
      label: "Link and redirect risk",
      value: breakdown.urlThreat,
      description: "Suspicious links, redirect language, and click-through prompts.",
    },
    {
      key: "emailThreatIndicators",
      label: "Credential theft risk",
      value: breakdown.emailThreatIndicators,
      description: "Requests for passwords, one-time codes, or other sensitive details.",
    },
  ];
}

function uniqueSignals(signals: string[]) {
  return Array.from(new Set(signals));
}

function inferScamCategory(messageText: string, channel: IAnalysisSession["channel"], signals: string[]): string {
  const lower = messageText.toLowerCase();

  if (/payroll|direct deposit|salary|employee portal/.test(lower)) return "Payroll scam";
  if (/bank|card|account alert|transaction|deposit/.test(lower)) return "Banking impersonation";
  if (/invoice|payment|wire|transfer|vendor/.test(lower)) return "Invoice fraud";
  if (/romance|love|relationship|gift card/.test(lower)) return "Romance scam";
  if (/job|recruit|employment|interview/.test(lower)) return "Employment scam";
  if (/tax agency|government|cra|service canada|benefit/.test(lower)) return "Government impersonation";
  if (signals.includes("credential request")) return "Account takeover";
  if (channel === "Phone") return "Voice impersonation";
  return "Credential phishing";
}

function buildTriageSummary(
  scamCategory: string,
  severity: IAnalysisSession["severity"],
  channel: IAnalysisSession["channel"],
  signals: string[],
) {
  const topSignals = signals.slice(0, 3).join(", ");
  return `This appears to be a ${severity.toLowerCase()} ${scamCategory.toLowerCase()} delivered through ${channel.toLowerCase()}. The strongest indicators are ${topSignals || "suspicious language patterns"}, so the safest next step is to verify independently and preserve the evidence.`;
}

function buildRecommendations(
  scamCategory: string,
  severity: IAnalysisSession["severity"],
  channel: IAnalysisSession["channel"],
  signals: string[],
): IRecommendedAction[] {
  const preservationText =
    channel === "Email"
      ? "Preserve the full email, including the sender line, timestamps, and any visible headers."
      : channel === "Phone"
        ? "Write down the phone number, call time, caller claims, and any instructions you were given."
        : `Preserve the ${channel.toLowerCase()} conversation, screenshots, and attachment names before taking action.`;

  const actions: IRecommendedAction[] = [
    {
      title: "Stop direct engagement",
      description: "Do not reply, click links, or share codes until the sender is independently verified.",
      priority: "now",
    },
    {
      title: "Preserve evidence",
      description: preservationText,
      priority: "now",
    },
    {
      title: "Verify through official channels",
      description: "Contact the institution using a trusted website, card-back number, or saved phone number.",
      priority: "soon",
    },
  ];

  if (scamCategory === "Payroll scam") {
    actions.push({
      title: "Confirm with payroll or HR",
      description: "Use your company directory or HR portal to confirm whether any payroll action is actually required.",
      priority: "now",
    });
  }

  if (scamCategory === "Banking impersonation" || scamCategory === "Invoice fraud") {
    actions.push({
      title: "Call the financial institution directly",
      description: "Use an official number to verify whether your account, transfer, or invoice request is legitimate.",
      priority: "now",
    });
  }

  if (scamCategory === "Romance scam") {
    actions.push({
      title: "Pause any payment or gift transfer",
      description: "Stop sending money, gift cards, or personal documents until the identity claim is verified offline.",
      priority: "now",
    });
  }

  if (signals.includes("credential request")) {
    actions.push({
      title: "Secure credentials",
      description: "Change affected passwords, rotate MFA, and revoke suspicious sessions if any credentials were shared.",
      priority: "now",
    });
  }

  if (severity === "High Risk" || severity === "Critical Risk") {
    actions.push({
      title: "Prepare a private report",
      description: "Turn this analysis into a report so the incident timeline and evidence are recorded.",
      priority: "soon",
    });
  }

  if (severity === "Critical Risk") {
    actions.push({
      title: "Contact financial institutions immediately",
      description: "If money or credentials were exposed, call your bank or provider using an official number now.",
      priority: "now",
    });
  }

  return actions;
}

function keywordSet(text: string) {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 5),
  );
}

function buildReportDraft(
  scamCategory: string,
  severity: IAnalysisSession["severity"],
  channel: IAnalysisSession["channel"],
  triageSummary: string,
  messageText: string,
  evidenceSummary: string | undefined,
  evidenceFiles: IEvidenceFile[],
): IGeneratedReportDraft {
  const suggestedStatus =
    severity === "Critical Risk"
      ? "escalated"
      : severity === "High Risk"
        ? "under_review"
        : "pending";

  const evidenceFileSummary =
    evidenceFiles.length > 0 ? `Attached evidence: ${evidenceFiles.map((file) => file.name).join(", ")}.` : "";
  const normalizedEvidenceDescription = [evidenceSummary, evidenceFileSummary]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    title: `${scamCategory} case from ${channel.toLowerCase()} evidence`,
    description: `${triageSummary}\n\nOriginal content summary:\n${messageText.trim().slice(0, 700)}`,
    evidenceDescription: normalizedEvidenceDescription || "No additional evidence notes were provided with this submission.",
    fraudType: scamCategory,
    channel,
    severity,
    suggestedStatus,
  };
}

function buildCaseTimeline(
  scamCategory: string,
  signals: string[],
  similarCases: ISimilarCase[],
  reportDraft: IGeneratedReportDraft,
): ICaseTimelineEvent[] {
  return [
    {
      step: "evidence_received",
      title: "Evidence received",
      description: "Raw suspicious content and supporting evidence were submitted for triage.",
    },
    {
      step: "signals_extracted",
      title: "Signals extracted",
      description: `The system extracted the strongest indicators: ${signals.slice(0, 4).join(", ")}.`,
    },
    {
      step: "category_assigned",
      title: "Scam category assigned",
      description: `The case was classified as ${scamCategory.toLowerCase()} based on the extracted signals and wording.`,
    },
    {
      step: "similar_cases_matched",
      title: "Similar cases matched",
      description:
        similarCases.length > 0
          ? `The analysis matched ${similarCases.length} similar prior case${similarCases.length > 1 ? "s" : ""} for context.`
          : "No strong prior case match was found, so the case remains primarily evidence-driven.",
    },
    {
      step: "playbook_generated",
      title: "Recovery playbook generated",
      description: "The next-step guidance was tailored to the scam category, severity, and message channel.",
    },
    {
      step: "report_draft_created",
      title: "Report draft created",
      description: `A private report draft was prepared with a suggested queue status of ${reportDraft.suggestedStatus.replace(/_/g, " ")}.`,
    },
  ];
}

async function findSimilarCases(candidate: {
  messageText: string;
  scamCategory: string;
  severity: IAnalysisSession["severity"];
  channel: IAnalysisSession["channel"];
  extractedSignals: string[];
}): Promise<ISimilarCase[]> {
  const sessions = await AnalysisSessionModel.find().sort({ createdAt: -1 }).limit(50);
  const candidateKeywords = keywordSet(candidate.messageText);

  return sessions
    .map((session) => {
      const sessionCategory = session.scamCategory || session.fraudType;
      const sessionSignals = session.extractedSignals || [];
      const matchingTraits: string[] = [];
      let score = 0;

      if (sessionCategory === candidate.scamCategory) {
        score += 32;
        matchingTraits.push(sessionCategory);
      }
      if (session.severity === candidate.severity) {
        score += 14;
        matchingTraits.push(candidate.severity);
      }
      if (session.channel === candidate.channel) {
        score += 10;
        matchingTraits.push(`${candidate.channel.toLowerCase()} channel`);
      }

      const sharedSignals = candidate.extractedSignals.filter((signal) => sessionSignals.includes(signal));
      if (sharedSignals.length > 0) {
        score += Math.min(24, sharedSignals.length * 8);
        matchingTraits.push(...sharedSignals);
      }

      const sessionKeywords = keywordSet(session.messageText || "");
      const sharedKeywords = Array.from(candidateKeywords).filter((word) => sessionKeywords.has(word));
      if (sharedKeywords.length > 0) {
        score += Math.min(20, sharedKeywords.length * 4);
      }

      return {
        caseId: String(session._id),
        title: session.reportDraft?.title || `${sessionCategory} case`,
        scamCategory: sessionCategory,
        similarityScore: Math.min(100, score),
        matchingTraits: uniqueSignals(matchingTraits).slice(0, 4),
        severity: session.severity,
        channel: session.channel,
      };
    })
    .filter((caseMatch) => caseMatch.similarityScore >= 24)
    .sort((left, right) => right.similarityScore - left.similarityScore)
    .slice(0, 3);
}

export async function analyzeSubmission(input: AnalysisInput): Promise<Omit<IAnalysisSession, "_id" | "createdAt" | "updatedAt">> {
  const breakdownRaw: IConfidenceBreakdown = {
    psychologicalManipulation: 0,
    urgencyPressure: 0,
    urlThreat: 0,
    emailThreatIndicators: 0,
  };

  const combinedText = [input.messageText, input.evidenceSummary].filter(Boolean).join("\n");
  const reasons: string[] = [];
  const extractedSignals: string[] = [];
  let score = 0;

  for (const rule of RULES) {
    if (rule.test.test(combinedText)) {
      score += rule.weight;
      breakdownRaw[rule.bucket] += rule.weight;
      reasons.push(rule.reason);
      extractedSignals.push(rule.signal);
    }
  }

  if (/\bfrom:\s*.*@(gmail|yahoo|outlook)\.com/i.test(combinedText)) {
    score += 8;
    breakdownRaw.emailThreatIndicators += 8;
    reasons.push("The sender appears to use a personal domain instead of an expected business address.");
    extractedSignals.push("personal sender domain");
  }

  if (input.channel === "SMS" && /http:\/\/|https:\/\/|bit\.ly|tinyurl/i.test(combinedText)) {
    score += 7;
    breakdownRaw.urlThreat += 7;
    reasons.push("Short-link or SMS link behavior increases risk and should be verified cautiously.");
    extractedSignals.push("shortened link");
  }

  score = Math.min(100, score);

  if (reasons.length === 0) {
    reasons.push("No high-confidence indicators were found, but suspicious messages should still be verified independently.");
    extractedSignals.push("manual review recommended");
  }

  const severity = getSeverityByScore(score);
  const confidenceBreakdown = normalizeBreakdown(breakdownRaw);
  const normalizedSignals = uniqueSignals(extractedSignals);
  const scamCategory = inferScamCategory(combinedText, input.channel, normalizedSignals);
  const triageSummary = buildTriageSummary(scamCategory, severity, input.channel, normalizedSignals);
  const reportDraft = buildReportDraft(
    scamCategory,
    severity,
    input.channel,
    triageSummary,
    input.messageText,
    input.evidenceSummary,
    input.evidenceFiles,
  );
  const similarCases = await findSimilarCases({
    messageText: input.messageText,
    scamCategory,
    severity,
    channel: input.channel,
    extractedSignals: normalizedSignals,
  });
  const caseTimeline = buildCaseTimeline(scamCategory, normalizedSignals, similarCases, reportDraft);
  const recommendations = buildRecommendations(scamCategory, severity, input.channel, normalizedSignals);

  return {
    createdBy: input.createdBy,
    messageText: input.messageText.trim(),
    channel: input.channel,
    evidenceSummary: input.evidenceSummary?.trim(),
    evidenceFiles: input.evidenceFiles,
    scamCategory,
    triageSummary,
    extractedSignals: normalizedSignals,
    fraudType: scamCategory,
    riskScore: score,
    confidence: Math.min(100, Math.round(score * 0.95 + 4)),
    severity,
    verdict: score >= 71 ? "Likely Fraud" : score >= 41 ? "Suspicious" : "Likely Legitimate",
    reasons,
    confidenceBreakdown,
    riskFactors: buildRiskFactors(confidenceBreakdown),
    similarCases,
    recommendedActions: recommendations,
    reportDraft,
    caseTimeline,
    safeUseNotice:
      "This is an academic triage result based on explainable heuristics. Treat it as decision support, not legal or forensic proof.",
  };
}
