import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

const uploadGuidance = [
  {
    title: "Safe to upload",
    items: [
      "Suspicious email text, SMS content, chat messages, and scam call summaries",
      "Screenshots of fake websites, login prompts, payment requests, or profile impersonation",
      "Evidence files that help explain the case, such as PDFs, screenshots, and exported messages",
    ],
  },
  {
    title: "Avoid uploading unless necessary",
    items: [
      "Full banking numbers, one-time codes, passwords, passport scans, or driver's licence images",
      "Private details about unrelated people who are not part of the incident",
      "Large personal document dumps when a smaller evidence extract would explain the issue clearly",
    ],
  },
];

const aiBoundaries = [
  "AI analysis can highlight suspicious patterns, but it can still miss context or overstate risk.",
  "Do not use the platform output to publicly accuse a person, business, or account without independent verification.",
  "Always confirm with official institutions, police, or financial providers before taking high-impact action.",
];

const escalationSignals = [
  "Money was sent, transferred, wired, or paid by gift card or cryptocurrency",
  "A password, security code, banking detail, or identity document was shared",
  "A malicious file may have been opened or remote access software may have been installed",
  "A device, email inbox, social account, or banking account may already be compromised",
  "The message includes threats, blackmail, extortion, or an immediate safety concern",
];

const evidenceChecklist = [
  "Original message or email with timestamps and sender details",
  "Full URL, website screenshot, or login page screenshot",
  "Phone number, caller name used, and exact wording if the scam happened by phone",
  "Transaction IDs, receipts, wallet addresses, payment references, or transfer details",
  "Short timeline of what happened and which actions were already taken after the incident",
];

const safeUseRules = [
  {
    title: "Private reporting only",
    description: "Use the app to document and triage cases privately. Do not publish names, accusations, or evidence in public-facing spaces from this workflow.",
  },
  {
    title: "Minimum necessary evidence",
    description: "Only upload what is needed to explain the suspicious interaction. Less sensitive data means less privacy risk for the user and others.",
  },
  {
    title: "Official verification first",
    description: "Before paying, calling back, sending documents, or taking legal action, verify through a trusted official website or institution number.",
  },
  {
    title: "Use it as decision support",
    description: "Treat the analysis as a support tool that helps organize a case, not as legal proof, digital forensics, or a law-enforcement determination.",
  },
];

export default function LegalCompliancePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Trust, privacy, and safe use"
        subtitle="A practical guide for what to upload, how to use AI analysis responsibly, and when to escalate to official help."
      />

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Safe Use Guide</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">What This Page Is For</h2>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              This page explains how to use the app safely, what evidence to upload, what to leave out, and when the
              situation should move beyond AI triage into official reporting, banking support, police, or cybercrime help.
            </p>
          </div>
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
            User protection first
          </span>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">What You Should Upload</h2>
          <p className="mt-2 text-sm text-gray-600">
            Keep uploads focused on the suspicious interaction itself. The goal is enough context for analysis without exposing unnecessary personal data.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {uploadGuidance.map((group) => (
              <article key={group.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">When To Escalate Immediately</h2>
          <p className="mt-2 text-sm text-gray-600">
            If any of these are true, do not rely only on the app. Move to your bank, platform, police, or cybercrime reporting channel quickly.
          </p>

          <div className="mt-4 space-y-3">
            {escalationSignals.map((signal) => (
              <div key={signal} className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm leading-6 text-red-800">{signal}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">How To Use AI Output Responsibly</h2>
          <div className="mt-4 space-y-3">
            {aiBoundaries.map((rule) => (
              <div key={rule} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm leading-6 text-gray-700">{rule}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Evidence Checklist Before Reporting</h2>
          <p className="mt-2 text-sm text-gray-600">
            Collect these items before you report to a bank, police service, or fraud agency. A clean record makes recovery much easier.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
            {evidenceChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900">Core Safe-Use Rules</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {safeUseRules.map((rule) => (
            <article key={rule.title} className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-gray-900">{rule.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{rule.description}</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
