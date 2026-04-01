import type { FraudAnalysis } from "../types/fraud";
import Card from "./ui/Card";

type Props = {
  analysis: FraudAnalysis | null;
};

type ResourceLink = {
  title: string;
  organization: string;
  description: string;
  href: string;
  ctaLabel: string;
  whenToUse: string;
};

function buildEvidenceText(analysis: FraudAnalysis) {
  return `${analysis.message} ${analysis.evidenceSummary ?? ""}`.toLowerCase();
}

function getReportingResources(analysis: FraudAnalysis): ResourceLink[] {
  const evidenceText = buildEvidenceText(analysis);
  const isGovernmentLike = /cra|tax|service canada|benefit|government|sin|immigration/.test(evidenceText);
  const isElectronicMessage = ["Email", "SMS", "Social Media", "Website"].includes(analysis.channel);

  const resources: ResourceLink[] = [
    {
      title: "Report Fraud and Cybercrime",
      organization: "Canadian Anti-Fraud Centre",
      description: "Canada's main official reporting portal for fraud and cybercrime, whether you lost money or only received the attempt.",
      href: "https://antifraudcentre-centreantifraude.ca/report-signalez-eng.htm",
      ctaLabel: "Open CAFC reporting",
      whenToUse: "Use this for phishing, fake calls, scam texts, fake websites, payment scams, identity theft, and online fraud.",
    },
    {
      title: "National Cybercrime Reporting",
      organization: "RCMP / NC3",
      description: "The RCMP explains how cybercrime and fraud reports feed into Canada's national cybercrime coordination process.",
      href: "https://rcmp.ca/en/federal-policing/cybercrime/national-cybercrime-coordination-centre/report-cybercrime-and-fraud",
      ctaLabel: "View RCMP cybercrime reporting",
      whenToUse: "Use this if the case involves hacking, malware, phishing, account compromise, ransomware, or online extortion.",
    },
    {
      title: "Cyber Incident Guidance",
      organization: "Canadian Centre for Cyber Security",
      description: "Official guidance for individuals dealing with cyber incidents, including what to report and when to involve police.",
      href: "https://www.cyber.gc.ca/en/incident-management/report-cyber-incident-individuals",
      ctaLabel: "Open cyber incident guidance",
      whenToUse: "Use this if a suspicious email, file, or website may have infected a device or exposed an account.",
    },
    {
      title: "Ontario Scam and Fraud Guidance",
      organization: "Government of Ontario",
      description: "Ontario's official consumer guidance on scam warning signs, what to do next, and what records to keep for police and fraud reporting.",
      href: "https://www.ontario.ca/page/report-scam-or-fraud",
      ctaLabel: "Open Ontario fraud guidance",
      whenToUse: "Use this for Ontario-specific help, records to collect, and next steps after a scam or identity theft event.",
    },
    {
      title: "Police Reporting for OPP Areas",
      organization: "Ontario Provincial Police",
      description: "Official online police reporting for eligible non-emergency incidents in areas policed by the OPP.",
      href: "https://beta.opp.ca/index.php?id=132",
      ctaLabel: "Open OPP online reporting",
      whenToUse: "Use this if the incident happened in an OPP-policed area and qualifies for non-emergency online reporting.",
    },
  ];

  if (isElectronicMessage) {
    resources.push({
      title: "Spam Reporting Centre",
      organization: "Office of the Privacy Commissioner of Canada",
      description: "Official route to submit spam and other electronic threats under Canada's anti-spam framework.",
      href: "https://www.priv.gc.ca/en/report-a-concern/report-spam/?wbdisable=true",
      ctaLabel: "Open spam reporting info",
      whenToUse: "Use this for spam emails, spam texts, and unsolicited commercial electronic messages.",
    });
  }

  if (isGovernmentLike || analysis.scamCategory === "Government impersonation") {
    resources.push({
      title: "Report CRA Scam or Identity Theft",
      organization: "Canada Revenue Agency",
      description: "Official CRA page for reporting scam activity, suspicious account changes, and identity theft concerns tied to tax or benefit impersonation.",
      href: "https://www.canada.ca/en/revenue-agency/corporate/scams-fraud/report-scam.html",
      ctaLabel: "Open CRA scam reporting",
      whenToUse: "Use this if the message claimed to be from the CRA, tax authorities, benefits staff, or asked about your CRA account.",
    });
  }

  return resources;
}

function getResponseChecklist(analysis: FraudAnalysis): string[] {
  const evidenceText = buildEvidenceText(analysis);
  const checklist: string[] = [
    "Save screenshots, email headers, phone numbers, website URLs, payment receipts, and a short timeline before anything is deleted.",
    "Stop communicating with the scammer and only verify through official phone numbers or websites you looked up yourself.",
  ];

  if (/clicked|opened the link|visited the link|went to the website/.test(evidenceText) || analysis.channel === "Website") {
    checklist.push("If you clicked the link or used the website, run a device scan, review downloads, and sign out of important accounts.");
  }

  if (/entered password|entered code|shared password|shared otp|shared code|login/.test(evidenceText) || analysis.extractedSignals.includes("credential request")) {
    checklist.push("If you entered a password or code, change that password now, enable MFA, and review recent account sign-ins.");
  }

  if (/sent money|wire|gift card|bitcoin|crypto|etran?sfer|e-transfer|paid/.test(evidenceText)) {
    checklist.push("If money was sent, call your bank, card issuer, or payment provider immediately and ask for fraud review or reversal options.");
  }

  if (/sin|social insurance|identity|passport|driver/.test(evidenceText)) {
    checklist.push("If identity details were shared, contact your financial institutions and consider placing fraud alerts with the credit bureaus.");
  }

  checklist.push("If someone is in immediate danger, money is actively moving, or a crime is in progress, contact local police or call 911.");

  return checklist.slice(0, 6);
}

export default function OfficialReportingResources({ analysis }: Props) {
  if (!analysis) {
    return null;
  }

  const reportingResources = getReportingResources(analysis);
  const responseChecklist = getResponseChecklist(analysis);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Official Reporting and Recovery</h3>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Use these official websites to report the scam, escalate cybercrime, and follow recognized recovery steps.
          </p>
        </div>
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
          {reportingResources.length} official resources
        </span>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-700">Response Checklist</h4>
          <div className="mt-4 space-y-3">
            {responseChecklist.map((item) => (
              <div key={item} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm leading-6 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reportingResources.map((resource) => (
            <article key={`${resource.organization}-${resource.title}`} className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">{resource.organization}</p>
              <h4 className="mt-2 text-base font-semibold text-gray-900">{resource.title}</h4>
              <p className="mt-3 text-sm leading-6 text-gray-700">{resource.description}</p>
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs uppercase tracking-wide text-gray-400">When to use it</p>
                <p className="mt-1 text-sm leading-6 text-gray-700">{resource.whenToUse}</p>
              </div>
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {resource.ctaLabel}
              </a>
            </article>
          ))}
        </div>
      </div>
    </Card>
  );
}
