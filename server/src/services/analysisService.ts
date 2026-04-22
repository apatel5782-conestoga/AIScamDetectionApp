import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

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
import { REFERENCE_FRAUD_CASES } from "../data/referenceFraudCases";

export type AnalysisInput = {
  createdBy?: string;
  messageText: string;
  channel: IAnalysisSession["channel"];
  evidenceSummary?: string;
  evidenceFiles: IEvidenceFile[];
  extractedFileContent?: string;
};

type OpenAIAnalysisResult = {
  riskScore: number;
  verdict: "Likely Legitimate" | "Suspicious" | "Likely Fraud";
  scamCategory: string;
  triageSummary: string;
  reasons: string[];
  extractedSignals: string[];
  confidenceBreakdown: IConfidenceBreakdown;
};

const OPENAI_SYSTEM_PROMPT = `You are an expert cybersecurity analyst specializing in fraud, phishing, and scam detection.
Analyze the provided message or document content and return a structured fraud risk assessment.

Return ONLY valid JSON matching this exact structure (no extra text):
{
  "riskScore": <integer 0-100>,
  "verdict": "<Likely Legitimate | Suspicious | Likely Fraud>",
  "scamCategory": "<one of: Payroll scam | Banking impersonation | Invoice fraud | Romance scam | Employment scam | Government impersonation | Account takeover | Voice impersonation | Credential phishing | Cryptocurrency scam | Tech support scam | Lottery scam | Investment fraud | Business Email Compromise | Identity theft | Other>",
  "triageSummary": "<2-3 sentence professional analysis explaining what this is and why it is or isn't suspicious>",
  "reasons": ["<specific reason 1>", "<specific reason 2>", ...],
  "extractedSignals": ["<signal label 1>", "<signal label 2>", ...],
  "confidenceBreakdown": {
    "psychologicalManipulation": <0-100>,
    "urgencyPressure": <0-100>,
    "urlThreat": <0-100>,
    "emailThreatIndicators": <0-100>
  }
}

Signal labels should be short (e.g. "urgency language", "credential request", "suspicious link", "authority impersonation", "fear pressure", "personal sender domain", "shortened link", "prize claim", "romance manipulation", "investment offer").

RiskScore guide: 0-40 = Low Risk (Likely Legitimate), 41-70 = Medium Risk (Suspicious), 71-85 = High Risk (Likely Fraud), 86-100 = Critical Risk (Likely Fraud).
confidenceBreakdown values should sum to 100.`;

async function analyzeWithOpenAI(
  messageText: string,
  channel: string,
  evidenceSummary: string | undefined,
  extractedFileContent: string | undefined,
): Promise<OpenAIAnalysisResult> {
  const contentParts: string[] = [];
  contentParts.push(`Channel: ${channel}`);
  contentParts.push(`Message/Content:\n${messageText}`);
  if (evidenceSummary?.trim()) {
    contentParts.push(`Additional Evidence Summary:\n${evidenceSummary}`);
  }
  if (extractedFileContent?.trim()) {
    contentParts.push(`Extracted File Content:\n${extractedFileContent.slice(0, 4000)}`);
  }

  const userContent = contentParts.join("\n\n---\n\n");

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: OPENAI_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 1000,
  });

  const raw = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw) as Partial<OpenAIAnalysisResult>;

  return {
    riskScore: Math.min(100, Math.max(0, Number(parsed.riskScore) || 0)),
    verdict: (["Likely Legitimate", "Suspicious", "Likely Fraud"].includes(parsed.verdict || ""))
      ? (parsed.verdict as OpenAIAnalysisResult["verdict"])
      : "Suspicious",
    scamCategory: String(parsed.scamCategory || "Credential phishing"),
    triageSummary: String(parsed.triageSummary || "Analysis completed."),
    reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map(String) : [],
    extractedSignals: Array.isArray(parsed.extractedSignals) ? parsed.extractedSignals.map(String) : [],
    confidenceBreakdown: {
      psychologicalManipulation: Number(parsed.confidenceBreakdown?.psychologicalManipulation) || 25,
      urgencyPressure: Number(parsed.confidenceBreakdown?.urgencyPressure) || 25,
      urlThreat: Number(parsed.confidenceBreakdown?.urlThreat) || 25,
      emailThreatIndicators: Number(parsed.confidenceBreakdown?.emailThreatIndicators) || 25,
    },
  };
}

// Fallback regex-based analysis if OpenAI fails
type Rule = { test: RegExp; weight: number; reason: string; bucket: keyof IConfidenceBreakdown; signal: string };
const RULES: Rule[] = [
  { test: /urgent|immediately|act now|last chance|final notice/i, weight: 19, reason: "Urgency pressure language detected.", bucket: "urgencyPressure", signal: "urgency language" },
  { test: /verify|password|otp|security code|pin|passcode/i, weight: 24, reason: "Message requests credentials or verification data.", bucket: "emailThreatIndicators", signal: "credential request" },
  { test: /click here|visit link|http:\/\/|https:\/\/|www\./i, weight: 21, reason: "Suspicious link or redirect pattern present.", bucket: "urlThreat", signal: "suspicious link" },
  { test: /dear customer|bank team|tax agency|government|compliance notice|payroll/i, weight: 18, reason: "Wording imitates an institution or authority.", bucket: "psychologicalManipulation", signal: "authority impersonation" },
  { test: /suspended|locked|penalty|lawsuit|legal action|arrest/i, weight: 17, reason: "Fear-based pressure language detected.", bucket: "psychologicalManipulation", signal: "fear pressure" },
];

function regexFallbackAnalysis(messageText: string, channel: IAnalysisSession["channel"], evidenceSummary?: string): OpenAIAnalysisResult {
  const combined = [messageText, evidenceSummary].filter(Boolean).join("\n");
  const breakdown: IConfidenceBreakdown = { psychologicalManipulation: 0, urgencyPressure: 0, urlThreat: 0, emailThreatIndicators: 0 };
  const reasons: string[] = [];
  const signals: string[] = [];
  let score = 0;

  for (const rule of RULES) {
    if (rule.test.test(combined)) {
      score += rule.weight;
      breakdown[rule.bucket] += rule.weight;
      reasons.push(rule.reason);
      signals.push(rule.signal);
    }
  }

  if (/\bfrom:\s*.*@(gmail|yahoo|outlook)\.com/i.test(combined)) {
    score += 8; breakdown.emailThreatIndicators += 8;
    reasons.push("Sender uses a personal email domain."); signals.push("personal sender domain");
  }
  if (channel === "SMS" && /http:\/\/|https:\/\/|bit\.ly|tinyurl/i.test(combined)) {
    score += 7; breakdown.urlThreat += 7;
    reasons.push("Shortened link in SMS increases risk."); signals.push("shortened link");
  }

  score = Math.min(100, score);
  if (reasons.length === 0) { reasons.push("No high-confidence indicators found. Verify independently."); signals.push("manual review recommended"); }

  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const norm: IConfidenceBreakdown = total > 0
    ? { psychologicalManipulation: Math.round(breakdown.psychologicalManipulation / total * 100), urgencyPressure: Math.round(breakdown.urgencyPressure / total * 100), urlThreat: Math.round(breakdown.urlThreat / total * 100), emailThreatIndicators: Math.round(breakdown.emailThreatIndicators / total * 100) }
    : { psychologicalManipulation: 25, urgencyPressure: 25, urlThreat: 25, emailThreatIndicators: 25 };

  const verdict: OpenAIAnalysisResult["verdict"] = score >= 71 ? "Likely Fraud" : score >= 41 ? "Suspicious" : "Likely Legitimate";
  const scamCategory = inferScamCategory(combined, channel, signals);

  return { riskScore: score, verdict, scamCategory, triageSummary: `This appears to be a ${scamCategory.toLowerCase()} delivered through ${channel.toLowerCase()}. The strongest indicators are ${signals.slice(0, 3).join(", ") || "suspicious language"}.`, reasons, extractedSignals: signals, confidenceBreakdown: norm };
}

function inferScamCategory(text: string, channel: IAnalysisSession["channel"], signals: string[]): string {
  const lower = text.toLowerCase();
  if (/payroll|direct deposit|salary|employee portal/.test(lower)) return "Payroll scam";
  if (/bank|card|account alert|transaction|deposit/.test(lower)) return "Banking impersonation";
  if (/invoice|payment|wire|transfer|vendor/.test(lower)) return "Invoice fraud";
  if (/romance|love|relationship|gift card/.test(lower)) return "Romance scam";
  if (/job|recruit|employment|interview/.test(lower)) return "Employment scam";
  if (/tax agency|government|cra|service canada|benefit/.test(lower)) return "Government impersonation";
  if (/bitcoin|crypto|ethereum|wallet|nft/.test(lower)) return "Cryptocurrency scam";
  if (/tech support|microsoft|apple|virus|computer/.test(lower)) return "Tech support scam";
  if (/lottery|winner|prize|congratulations/.test(lower)) return "Lottery scam";
  if (/invest|returns|profit|trading|forex/.test(lower)) return "Investment fraud";
  if (signals.includes("credential request")) return "Account takeover";
  if (channel === "Phone") return "Voice impersonation";
  return "Credential phishing";
}

function getSeverityByScore(score: number): IAnalysisSession["severity"] {
  if (score >= 86) return "Critical Risk";
  if (score >= 71) return "High Risk";
  if (score >= 41) return "Medium Risk";
  return "Low Risk";
}

function buildRiskFactors(breakdown: IConfidenceBreakdown): IRiskFactor[] {
  return [
    { key: "psychologicalManipulation", label: "Psychological manipulation", value: breakdown.psychologicalManipulation, description: "Authority mimicry, fear language, and emotional pressure." },
    { key: "urgencyPressure", label: "Urgency pressure", value: breakdown.urgencyPressure, description: "Signals that pressure the user to act quickly without verification." },
    { key: "urlThreat", label: "Link and redirect risk", value: breakdown.urlThreat, description: "Suspicious links, redirect language, and click-through prompts." },
    { key: "emailThreatIndicators", label: "Credential theft risk", value: breakdown.emailThreatIndicators, description: "Requests for passwords, one-time codes, or other sensitive details." },
  ];
}

function detectExposureSignals(text: string) {
  const lower = text.toLowerCase();

  return {
    clickedLink: /clicked|opened the link|tap(?:ped)? the link|visited the link|went to the website/.test(lower),
    openedAttachment: /opened attachment|downloaded attachment|opened file|opened pdf|opened document/.test(lower),
    replied: /replied|responded|called them back|messaged back|texted back/.test(lower),
    sharedCredentials: /gave password|shared password|shared otp|shared code|sent code|entered password|entered otp|entered code|login details|bank details/.test(lower),
    sentMoney: /sent money|wire transfer|transferred money|gift card|crypto|bitcoin|paid them|etran?sfer|e-transfer/.test(lower),
    installedSoftware: /installed|downloaded app|remote access|anydesk|teamviewer|screen share|screensharing/.test(lower),
    calledNumber: /called the number|phoned the number|dialed the number/.test(lower),
  };
}

function dedupeActions(actions: IRecommendedAction[]) {
  return actions.filter(
    (action, index, allActions) =>
      allActions.findIndex((candidate) => candidate.title === action.title && candidate.description === action.description) === index,
  );
}

function buildRecommendations(
  scamCategory: string,
  severity: IAnalysisSession["severity"],
  channel: IAnalysisSession["channel"],
  signals: string[],
  combinedEvidenceText: string,
): IRecommendedAction[] {
  const exposure = detectExposureSignals(combinedEvidenceText);
  const preservationText = channel === "Email" ? "Preserve the full email including sender line, timestamps, and headers." : channel === "Phone" ? "Write down the phone number, call time, and any instructions given." : `Preserve the ${channel.toLowerCase()} conversation and screenshots.`;
  const actions: IRecommendedAction[] = [
    { title: "Stop direct engagement", description: "Do not reply, click links, or share codes until sender is independently verified.", priority: "now" },
    { title: "Preserve evidence", description: preservationText, priority: "now" },
    { title: "Verify through official channels", description: "Contact the institution using a trusted website or card-back number.", priority: "soon" },
  ];
  if (channel === "Email") actions.push({ title: "Block and report the sender", description: "Mark the message as phishing or spam in your email provider and block the sender after saving evidence.", priority: "soon" });
  if (channel === "SMS") actions.push({ title: "Block the number", description: "Block the sender and report the text as junk to your mobile carrier or device spam tools.", priority: "soon" });
  if (channel === "Phone") actions.push({ title: "Do not trust caller ID", description: "Treat the displayed number as spoofable and verify any claim by hanging up and calling the official number yourself.", priority: "now" });
  if (channel === "Website") actions.push({ title: "Leave the site immediately", description: "Close the suspicious page and do not submit forms, install software, or allow browser notifications.", priority: "now" });
  if (scamCategory === "Payroll scam") actions.push({ title: "Confirm with payroll or HR", description: "Use your company directory or HR portal to confirm.", priority: "now" });
  if (["Banking impersonation", "Invoice fraud"].includes(scamCategory)) actions.push({ title: "Call the financial institution directly", description: "Use an official number to verify legitimacy.", priority: "now" });
  if (scamCategory === "Romance scam") actions.push({ title: "Pause any payment or gift transfer", description: "Stop sending money or gift cards until identity is verified offline.", priority: "now" });
  if (scamCategory === "Government impersonation") actions.push({ title: "Ignore threats and verify independently", description: "Government agencies do not resolve penalties or arrest threats through random links, gift cards, or urgent phone payment.", priority: "now" });
  if (scamCategory === "Investment fraud") actions.push({ title: "Stop deposits immediately", description: "Do not send more funds to trading platforms, wallet addresses, or recovery agents promising guaranteed returns.", priority: "now" });
  if (scamCategory === "Tech support scam") actions.push({ title: "Remove remote access immediately", description: "If you allowed remote access, disconnect the device from the internet and uninstall the remote-access tool before using it again.", priority: "now" });
  if (signals.includes("credential request")) actions.push({ title: "Secure credentials", description: "Change affected passwords, rotate MFA, and revoke suspicious sessions.", priority: "now" });
  if (exposure.clickedLink) actions.push({ title: "Check the device after the click", description: "Run a security scan, review downloads, and sign out of important accounts if you clicked the suspicious link.", priority: "now" });
  if (exposure.openedAttachment) actions.push({ title: "Scan downloaded files", description: "Run antivirus or endpoint scans on the device and do not reopen the attachment until it is cleared.", priority: "now" });
  if (exposure.sharedCredentials) actions.push({ title: "Reset exposed accounts", description: "Immediately change passwords for the affected account, enable MFA, and review recent sign-in history.", priority: "now" });
  if (exposure.sentMoney) actions.push({ title: "Contact the payment provider now", description: "Call your bank, card issuer, or transfer service using an official number and ask about reversal, blocking, or fraud holds.", priority: "now" });
  if (exposure.installedSoftware) actions.push({ title: "Disconnect and inspect the device", description: "Disconnect from the internet, remove suspicious software, and have the device checked if a remote-access or unknown app was installed.", priority: "now" });
  if (exposure.replied || exposure.calledNumber) actions.push({ title: "Expect follow-up attempts", description: "Once a scammer gets engagement, they may keep contacting you. Ignore further contact and tighten account monitoring.", priority: "monitor" });
  if (severity === "High Risk" || severity === "Critical Risk") actions.push({ title: "Prepare a private report", description: "Turn this analysis into a report to record the incident timeline and evidence.", priority: "soon" });
  if (severity === "Critical Risk") actions.push({ title: "Contact financial institutions immediately", description: "If money or credentials were exposed, call your bank using an official number now.", priority: "now" });
  actions.push({ title: "Report the scam attempt", description: "Report the incident to your organization, platform, bank, police, or fraud-reporting channel so the pattern can be tracked and blocked.", priority: "soon" });
  return dedupeActions(actions).slice(0, 8);
}

function buildReportDraft(scamCategory: string, severity: IAnalysisSession["severity"], channel: IAnalysisSession["channel"], triageSummary: string, messageText: string, evidenceSummary: string | undefined, evidenceFiles: IEvidenceFile[]): IGeneratedReportDraft {
  const suggestedStatus = severity === "Critical Risk" ? "escalated" : severity === "High Risk" ? "under_review" : "pending";
  const evidenceFileSummary = evidenceFiles.length > 0 ? `Attached evidence: ${evidenceFiles.map((f) => f.name).join(", ")}.` : "";
  const normalizedEvidenceDescription = [evidenceSummary, evidenceFileSummary].filter(Boolean).join(" ").trim();
  return {
    title: `${scamCategory} case from ${channel.toLowerCase()} evidence`,
    description: `${triageSummary}\n\nOriginal content summary:\n${messageText.trim().slice(0, 700)}`,
    evidenceDescription: normalizedEvidenceDescription || "No additional evidence notes were provided.",
    fraudType: scamCategory,
    channel,
    severity,
    suggestedStatus,
  };
}

function buildCaseTimeline(scamCategory: string, signals: string[], similarCases: ISimilarCase[], reportDraft: IGeneratedReportDraft): ICaseTimelineEvent[] {
  return [
    { step: "evidence_received", title: "Evidence received", description: "Raw suspicious content and supporting evidence were submitted for triage." },
    { step: "signals_extracted", title: "Signals extracted", description: `GPT-4 extracted the strongest indicators: ${signals.slice(0, 4).join(", ")}.` },
    { step: "category_assigned", title: "Scam category assigned", description: `The case was classified as ${scamCategory.toLowerCase()} by AI analysis.` },
    { step: "similar_cases_matched", title: "Similar cases matched", description: similarCases.length > 0 ? `Matched ${similarCases.length} similar prior case${similarCases.length > 1 ? "s" : ""} for context.` : "No strong prior case match found." },
    { step: "playbook_generated", title: "Recovery playbook generated", description: "Next-step guidance was tailored to the scam category, severity, and message channel." },
    { step: "report_draft_created", title: "Report draft created", description: `A private report draft was prepared with a suggested queue status of ${reportDraft.suggestedStatus.replace(/_/g, " ")}.` },
  ];
}

function keywordSet(text: string) {
  return new Set(text.toLowerCase().split(/[^a-z0-9]+/).map((w) => w.trim()).filter((w) => w.length >= 4));
}

type SimilarCaseCandidate = {
  caseId: string;
  title: string;
  scamCategory: string;
  severity: IAnalysisSession["severity"];
  channel: IAnalysisSession["channel"];
  extractedSignals: string[];
  combinedText: string;
  caseSummary?: string;
  sourceType: "prior_analysis" | "reference_playbook";
  matchingTraits?: string[];
};

function scoreSimilarCase(
  candidate: { combinedText: string; scamCategory: string; severity: IAnalysisSession["severity"]; channel: IAnalysisSession["channel"]; extractedSignals: string[] },
  otherCase: SimilarCaseCandidate,
): ISimilarCase {
  const candidateKeywords = keywordSet(candidate.combinedText);
  const sessionKeywords = keywordSet(otherCase.combinedText);
  const matchingTraits: string[] = [...(otherCase.matchingTraits ?? [])];
  let score = 0;

  if (otherCase.scamCategory === candidate.scamCategory) {
    score += 34;
    matchingTraits.push(otherCase.scamCategory);
  }
  if (otherCase.severity === candidate.severity) {
    score += 14;
    matchingTraits.push(candidate.severity);
  }
  if (otherCase.channel === candidate.channel) {
    score += 12;
    matchingTraits.push(`${candidate.channel.toLowerCase()} channel`);
  }

  const sharedSignals = candidate.extractedSignals.filter((signal) => otherCase.extractedSignals.includes(signal));
  if (sharedSignals.length > 0) {
    score += Math.min(24, sharedSignals.length * 8);
    matchingTraits.push(...sharedSignals);
  }

  const sharedKeywords = Array.from(candidateKeywords).filter((keyword) => sessionKeywords.has(keyword));
  if (sharedKeywords.length > 0) {
    score += Math.min(20, sharedKeywords.length * 4);
    matchingTraits.push(...sharedKeywords.slice(0, 2));
  }

  return {
    caseId: otherCase.caseId,
    title: otherCase.title,
    scamCategory: otherCase.scamCategory,
    similarityScore: Math.min(100, score),
    matchingTraits: Array.from(new Set(matchingTraits)).slice(0, 5),
    severity: otherCase.severity,
    channel: otherCase.channel,
    caseSummary: otherCase.caseSummary,
    sourceType: otherCase.sourceType,
  };
}

async function findSimilarCases(candidate: { combinedText: string; scamCategory: string; severity: IAnalysisSession["severity"]; channel: IAnalysisSession["channel"]; extractedSignals: string[] }): Promise<ISimilarCase[]> {
  const sessions = await AnalysisSessionModel.find().sort({ createdAt: -1 }).limit(50);
  const priorCaseCandidates: SimilarCaseCandidate[] = sessions.map((session) => {
    const sessionCategory = session.scamCategory || session.fraudType;
    const sessionSummary = [session.triageSummary, session.evidenceSummary, session.messageText].filter(Boolean).join(" ");
    return {
      caseId: String(session._id),
      title: session.reportDraft?.title || `${sessionCategory} case`,
      scamCategory: sessionCategory,
      severity: session.severity,
      channel: session.channel,
      extractedSignals: session.extractedSignals || [],
      combinedText: sessionSummary,
      caseSummary: session.triageSummary,
      sourceType: "prior_analysis",
    };
  });

  const referenceCandidates: SimilarCaseCandidate[] = REFERENCE_FRAUD_CASES.map((referenceCase) => ({
    caseId: referenceCase.caseId,
    title: referenceCase.title,
    scamCategory: referenceCase.scamCategory,
    severity: referenceCase.severity,
    channel: referenceCase.channel,
    extractedSignals: referenceCase.signals,
    combinedText: `${referenceCase.caseSummary} ${referenceCase.keywords.join(" ")}`,
    caseSummary: referenceCase.caseSummary,
    sourceType: "reference_playbook",
    matchingTraits: referenceCase.matchingTraits,
  }));

  return [...priorCaseCandidates, ...referenceCandidates]
    .map((otherCase) => scoreSimilarCase(candidate, otherCase))
    .filter((caseMatch) => caseMatch.similarityScore >= 22)
    .sort((left, right) => right.similarityScore - left.similarityScore)
    .slice(0, 4);
}

export async function analyzeSubmission(input: AnalysisInput): Promise<Omit<IAnalysisSession, "_id" | "createdAt" | "updatedAt">> {
  let aiResult: OpenAIAnalysisResult;

  try {
    aiResult = await analyzeWithOpenAI(input.messageText, input.channel, input.evidenceSummary, input.extractedFileContent);
  } catch {
    console.warn("OpenAI analysis failed, falling back to rule-based analysis.");
    aiResult = regexFallbackAnalysis(input.messageText, input.channel, input.evidenceSummary);
  }

  const { riskScore, verdict, scamCategory, triageSummary, reasons, extractedSignals, confidenceBreakdown } = aiResult;
  const severity = getSeverityByScore(riskScore);
  const combinedEvidenceText = [input.messageText, input.evidenceSummary, input.extractedFileContent].filter(Boolean).join("\n");
  const reportDraft = buildReportDraft(scamCategory, severity, input.channel, triageSummary, input.messageText, input.evidenceSummary, input.evidenceFiles);
  const similarCases = await findSimilarCases({ combinedText: combinedEvidenceText, scamCategory, severity, channel: input.channel, extractedSignals });
  const caseTimeline = buildCaseTimeline(scamCategory, extractedSignals, similarCases, reportDraft);
  const recommendations = buildRecommendations(scamCategory, severity, input.channel, extractedSignals, combinedEvidenceText);

  return {
    createdBy: input.createdBy,
    messageText: input.messageText.trim(),
    channel: input.channel,
    evidenceSummary: input.evidenceSummary?.trim(),
    evidenceFiles: input.evidenceFiles,
    scamCategory,
    triageSummary,
    extractedSignals,
    fraudType: scamCategory,
    riskScore,
    confidence: Math.min(100, Math.round(riskScore * 0.95 + 4)),
    severity,
    verdict,
    reasons,
    confidenceBreakdown,
    riskFactors: buildRiskFactors(confidenceBreakdown),
    similarCases,
    recommendedActions: recommendations,
    reportDraft,
    caseTimeline,
    safeUseNotice: "This analysis is powered by GPT-4 AI. Treat it as decision support, not legal or forensic proof.",
  };
}
