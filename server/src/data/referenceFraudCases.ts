import type { AnalysisSeverity, IAnalysisSession } from "../models/AnalysisSession";

export type ReferenceFraudCase = {
  caseId: string;
  title: string;
  scamCategory: string;
  channel: IAnalysisSession["channel"];
  severity: AnalysisSeverity;
  caseSummary: string;
  matchingTraits: string[];
  keywords: string[];
  signals: string[];
};

export const REFERENCE_FRAUD_CASES: ReferenceFraudCase[] = [
  {
    caseId: "ref-payroll-update-email",
    title: "Payroll direct-deposit change email",
    scamCategory: "Payroll scam",
    channel: "Email",
    severity: "High Risk",
    caseSummary: "An employee receives an urgent email asking them to update payroll or direct-deposit details through a linked form controlled by the attacker.",
    matchingTraits: ["payroll", "direct deposit", "urgent request", "impersonation"],
    keywords: ["payroll", "salary", "direct deposit", "employee portal", "bank details", "update account"],
    signals: ["urgency language", "authority impersonation", "credential request", "suspicious link"],
  },
  {
    caseId: "ref-bank-security-sms",
    title: "Bank account alert text",
    scamCategory: "Banking impersonation",
    channel: "SMS",
    severity: "High Risk",
    caseSummary: "A text message claims a bank account is locked or a transaction needs verification, then pushes the victim to click a login link or call a fake number.",
    matchingTraits: ["bank alert", "sms", "account locked", "verification"],
    keywords: ["bank", "account locked", "verify transaction", "card", "security alert", "login now"],
    signals: ["urgency language", "suspicious link", "credential request", "fear pressure"],
  },
  {
    caseId: "ref-tech-support-popup",
    title: "Fake tech support website warning",
    scamCategory: "Tech support scam",
    channel: "Website",
    severity: "Critical Risk",
    caseSummary: "A browser page warns about malware or account compromise and instructs the user to call support, install software, or enter credentials.",
    matchingTraits: ["popup alert", "website", "call support", "install software"],
    keywords: ["virus", "microsoft", "apple support", "call now", "device infected", "remote access"],
    signals: ["fear pressure", "authority impersonation", "suspicious link"],
  },
  {
    caseId: "ref-government-benefit-email",
    title: "Government benefit verification email",
    scamCategory: "Government impersonation",
    channel: "Email",
    severity: "High Risk",
    caseSummary: "A message posing as a tax or benefit agency demands identity verification, payment, or immediate form completion to avoid penalties.",
    matchingTraits: ["government", "benefit", "tax", "identity verification"],
    keywords: ["cra", "service canada", "benefit", "tax refund", "government", "identity verification"],
    signals: ["authority impersonation", "fear pressure", "credential request", "urgency language"],
  },
  {
    caseId: "ref-romance-money-request",
    title: "Romance profile emergency cash request",
    scamCategory: "Romance scam",
    channel: "Social Media",
    severity: "High Risk",
    caseSummary: "A fraudster builds trust over time, then asks for emergency money, gift cards, or crypto while avoiding independent verification.",
    matchingTraits: ["social media", "relationship", "money request", "emotional pressure"],
    keywords: ["love", "relationship", "gift card", "emergency", "help me", "send money"],
    signals: ["psychological manipulation", "romance manipulation", "urgency language"],
  },
  {
    caseId: "ref-phone-police-impersonation",
    title: "Phone call from fake police or agency",
    scamCategory: "Voice impersonation",
    channel: "Phone",
    severity: "Critical Risk",
    caseSummary: "A caller claims to be from police, immigration, or a regulator and pressures the target into payment, personal information, or immediate action.",
    matchingTraits: ["phone call", "authority", "threat", "immediate action"],
    keywords: ["police", "warrant", "arrest", "immigration", "fine", "payment immediately"],
    signals: ["authority impersonation", "fear pressure", "urgency language"],
  },
  {
    caseId: "ref-investment-crypto-chat",
    title: "Crypto investment group message",
    scamCategory: "Investment fraud",
    channel: "Social Media",
    severity: "Critical Risk",
    caseSummary: "An online contact promises guaranteed returns or insider knowledge and directs the victim to a trading site or wallet deposit.",
    matchingTraits: ["crypto", "investment", "guaranteed return", "social media"],
    keywords: ["crypto", "bitcoin", "ethereum", "profit", "returns", "investment", "trading"],
    signals: ["investment offer", "suspicious link", "urgency language"],
  },
  {
    caseId: "ref-job-offer-deposit",
    title: "Fake remote job offer with payment request",
    scamCategory: "Employment scam",
    channel: "Email",
    severity: "High Risk",
    caseSummary: "A fake recruiter offers a job quickly and asks the applicant to pay for equipment, send banking details, or deposit a cheque.",
    matchingTraits: ["job offer", "recruiter", "equipment fee", "email"],
    keywords: ["job", "interview", "recruiter", "remote position", "equipment", "cheque"],
    signals: ["urgency language", "credential request", "authority impersonation"],
  },
  {
    caseId: "ref-invoice-vendor-change",
    title: "Vendor bank-change invoice email",
    scamCategory: "Invoice fraud",
    channel: "Email",
    severity: "Critical Risk",
    caseSummary: "A finance employee receives a believable invoice or vendor payment update that redirects funds to a criminal account.",
    matchingTraits: ["invoice", "vendor", "wire transfer", "bank change"],
    keywords: ["invoice", "vendor", "wire", "transfer", "payment", "bank account"],
    signals: ["authority impersonation", "urgency language", "payment redirection"],
  },
  {
    caseId: "ref-credential-reset-link",
    title: "Account reset credential phishing link",
    scamCategory: "Credential phishing",
    channel: "Email",
    severity: "High Risk",
    caseSummary: "The victim receives a password-reset or sign-in warning that leads to a fake login page designed to steal credentials and one-time codes.",
    matchingTraits: ["password reset", "login page", "email", "credential theft"],
    keywords: ["password reset", "sign in", "verify account", "mfa", "security code", "login"],
    signals: ["credential request", "suspicious link", "urgency language"],
  },
];
