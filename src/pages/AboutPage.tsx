import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

const platformSections = [
  {
    title: "Dashboard",
    description: "The dashboard is the home workspace. It gives a quick summary of how the app works, recent case activity, and the main path from analysis to reporting and recovery.",
  },
  {
    title: "Analyze",
    description: "The analysis page lets users paste suspicious emails, texts, phone call summaries, social messages, website content, and upload supporting evidence files. The system reviews the case, extracts risk signals, estimates severity, shows similar cases, and generates next-step guidance.",
  },
  {
    title: "Reports",
    description: "The reporting area turns an analysis result into a private case record. Users can store the incident summary, evidence description, fraud type, severity, and case status without publishing the allegation publicly.",
  },
  {
    title: "Recovery",
    description: "The recovery center provides structured post-incident steps. It helps users decide what to do if money was lost, credentials were exposed, identity details were shared, or a suspicious file or link was opened.",
  },
  {
    title: "Compliance / Safety Guide",
    description: "The compliance page explains safe upload behavior, privacy expectations, AI boundaries, what evidence should be collected, and when users should escalate to banks, police, or cybercrime channels instead of relying only on the app.",
  },
  {
    title: "Profile and Admin",
    description: "Signed-in users can access their own profile and case-related workflow. Admin access is separated so review and oversight stay controlled instead of becoming a public accusation system.",
  },
];

const coreCapabilities = [
  "AI-assisted fraud triage for suspicious emails, texts, calls, websites, and uploaded evidence",
  "File-aware evidence intake with support for screenshots, PDFs, email files, and related documents",
  "Risk scoring, severity classification, extracted scam signals, and explainable case summaries",
  "Similar-case matching using prior analyses and built-in fraud reference patterns",
  "Private report drafting so users can carry an analysis result into a structured case record",
  "Recovery guidance with action plans, official reporting resources, and post-incident checklists",
  "Ontario-focused fraud intelligence tools, including official local cyber fraud news sources",
];

const userJourney = [
  {
    step: "1",
    title: "Submit suspicious content",
    description: "The user pastes or uploads the suspicious material and describes any extra evidence or context.",
  },
  {
    step: "2",
    title: "Run AI triage",
    description: "The app analyzes the content, looks for scam patterns, evaluates risk, and prepares an explainable case result.",
  },
  {
    step: "3",
    title: "Review the outcome",
    description: "The user sees the case summary, extracted signals, risk factors, similar cases, and what to do next.",
  },
  {
    step: "4",
    title: "Create a private report",
    description: "If the case needs follow-up, the user can turn the result into a private incident record instead of sharing it publicly.",
  },
  {
    step: "5",
    title: "Recover and report officially",
    description: "The recovery and reporting guidance helps the user contact the right official resources, preserve evidence, and reduce further harm.",
  },
];

const valuePoints = [
  {
    title: "Explainable, not black-box",
    description: "The platform does not stop at a fraud score. It also shows the reasons, signals, and recommended actions behind the result.",
  },
  {
    title: "Private by design",
    description: "The workflow focuses on private case handling, structured documentation, and evidence preservation instead of public accusation or crowdsourced shaming.",
  },
  {
    title: "Built for real follow-up",
    description: "The analysis result connects directly to reporting, recovery, and official resource guidance so users can move from suspicion to action.",
  },
  {
    title: "Grounded in practical safety",
    description: "The app includes guidance on what to upload, what not to upload, and when a user should stop and call a bank, police service, or government agency.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="About"
        subtitle="A full overview of what this website does, how the workflow is organized, and how users can move from suspicious evidence to safer action."
      />

      <Card className="p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Platform Overview</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">What This Website Does</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-700">
            AI-Assisted Fraud Triage and Reporting is a guided fraud-support platform. It helps users review suspicious
            digital interactions, understand what signals look risky, preserve evidence, generate private case records,
            and follow structured recovery and official reporting steps. The platform is designed to help people respond
            more clearly to suspicious emails, texts, phone calls, fake websites, impersonation attempts, and related
            online fraud scenarios.
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-700">
            The website does not position itself as final legal proof or a replacement for police, banking fraud teams,
            or digital forensic experts. Instead, it acts as a decision-support and case-organization workspace that helps
            users move from confusion to a more structured response.
          </p>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Main Product Areas</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {platformSections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">{section.description}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Core Capabilities</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
            {coreCapabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900">How A User Moves Through The Website</h2>
        <p className="mt-2 text-sm text-gray-600">
          The platform is built as one connected workflow instead of a set of isolated pages.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {userJourney.map((item) => (
            <article key={item.step} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                {item.step}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{item.description}</p>
            </article>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900">Why This Platform Is Useful</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {valuePoints.map((point) => (
            <article key={point.title} className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-gray-900">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{point.description}</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
