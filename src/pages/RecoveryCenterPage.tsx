import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

const first24Hours = [
  {
    title: "Lock down exposed accounts",
    priority: "Now",
    description: "Change passwords for email, banking, and primary login accounts first. Turn on multi-factor authentication and sign out unknown devices.",
  },
  {
    title: "Stop money movement",
    priority: "Now",
    description: "Call your bank, card issuer, or payment provider using an official number and ask for fraud review, card replacement, or transfer hold options.",
  },
  {
    title: "Preserve evidence",
    priority: "Now",
    description: "Save screenshots, message headers, website URLs, phone numbers, transaction references, and the exact timeline of what happened.",
  },
  {
    title: "Report through official channels",
    priority: "Today",
    description: "Submit the incident to the Canadian Anti-Fraud Centre, local police or OPP where appropriate, and any affected institution or platform.",
  },
  {
    title: "Check identity exposure",
    priority: "Today",
    description: "Review whether SIN, passport, driver's licence, card numbers, or banking credentials were shared and escalate identity protection if needed.",
  },
  {
    title: "Monitor follow-up attempts",
    priority: "Next",
    description: "Scammers often come back after first contact. Watch for repeat calls, password reset emails, fake recovery offers, and social engineering follow-ups.",
  },
];

const recoveryTracks = [
  {
    title: "If money was lost",
    items: [
      "Ask the bank or payment provider whether the transfer can be reversed, frozen, recalled, or disputed.",
      "Document every payment reference, recipient account, gift card number, crypto wallet, and time of transfer.",
      "Request a written fraud case number and record the name of each representative you spoke with.",
    ],
  },
  {
    title: "If credentials were exposed",
    items: [
      "Reset passwords starting with email, banking, and cloud accounts because those can be used to reset everything else.",
      "Review account recovery settings, trusted devices, inbox forwarding rules, and MFA methods for changes you did not make.",
      "If a suspicious file or app was opened, run a security scan before using the device for sensitive accounts again.",
    ],
  },
  {
    title: "If identity data was shared",
    items: [
      "Contact affected institutions and ask what extra verification or fraud protection they can place on the account.",
      "Track new account openings, credit inquiries, benefit claims, and address or profile changes that you did not authorize.",
      "Keep a dated incident log so future disputes or police reports have a clean record of what was exposed and when.",
    ],
  },
  {
    title: "Preserve the case record",
    items: [
      "Keep the original message, screenshots, attachments, and website addresses intact even if they look embarrassing or incomplete.",
      "Store report IDs, fraud reference numbers, ticket numbers, and every contact made with institutions or police.",
      "Update your private case record as the response progresses so the recovery timeline stays usable.",
    ],
  },
];

const documentPack = [
  "The original suspicious message, email, text, or call summary",
  "Screenshots of the website, social profile, payment instructions, or fake login page",
  "Bank or card transaction IDs, e-transfer details, crypto wallet addresses, or gift card receipts",
  "A short timeline: when contact started, what was clicked, what was shared, and what actions were taken after",
  "Names of institutions contacted, support agent names, and official case or ticket numbers",
];

const officialResources = [
  {
    organization: "Canadian Anti-Fraud Centre",
    title: "National fraud reporting",
    href: "https://antifraudcentre-centreantifraude.ca/report-signalez-eng.htm",
    description: "Report phishing, scam calls, fake websites, identity theft, payment scams, and online fraud attempts.",
  },
  {
    organization: "RCMP / NC3",
    title: "Cybercrime and fraud reporting guidance",
    href: "https://rcmp.ca/en/federal-policing/cybercrime/national-cybercrime-coordination-centre/report-cybercrime-and-fraud",
    description: "Use this when the incident involves account compromise, malware, hacking, online extortion, or broader cybercrime.",
  },
  {
    organization: "Canadian Centre for Cyber Security",
    title: "Individual cyber incident guidance",
    href: "https://www.cyber.gc.ca/en/incident-management/report-cyber-incident-individuals",
    description: "Official advice for people dealing with suspicious links, malicious files, account compromise, or device security concerns.",
  },
  {
    organization: "Government of Ontario",
    title: "Ontario scam and fraud guidance",
    href: "https://www.ontario.ca/page/report-scam-or-fraud",
    description: "Ontario-focused next steps, reporting guidance, and evidence tips after a scam or fraud event.",
  },
  {
    organization: "Ontario Provincial Police",
    title: "OPP online reporting",
    href: "https://beta.opp.ca/index.php?id=132",
    description: "Official non-emergency online reporting for qualifying incidents in OPP-policed areas.",
  },
  {
    organization: "CRA",
    title: "Report tax and government impersonation scams",
    href: "https://www.canada.ca/en/revenue-agency/corporate/scams-fraud/report-scam.html",
    description: "Use this if the scam pretended to be from the CRA, a tax office, or a government benefits service.",
  },
];

function priorityClass(priority: string) {
  switch (priority) {
    case "Now":
      return "bg-red-50 text-red-700";
    case "Today":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-blue-50 text-blue-700";
  }
}

export default function RecoveryCenterPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Recovery Center"
        subtitle="Structured post-incident steps, official reporting resources, and practical recovery guidance after a suspicious interaction."
      />

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Recovery Command Center</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">First 24 Hours Playbook</h2>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Use this sequence after a scam, phishing message, fake website, or suspicious call. The goal is to reduce further damage,
              preserve evidence, and move into official reporting quickly.
            </p>
          </div>
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
            Incident response guide
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {first24Hours.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                  {index + 1}
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${priorityClass(step.priority)}`}>
                  {step.priority}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{step.description}</p>
            </article>
          ))}
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Recovery Tracks</h2>
          <p className="mt-2 text-sm text-gray-600">
            Follow the track that matches what was exposed. Many incidents need more than one track at the same time.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {recoveryTracks.map((track) => (
              <article key={track.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="text-lg font-semibold text-gray-900">{track.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
                  {track.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Incident Document Pack</h2>
            <p className="mt-2 text-sm text-gray-600">
              Keep these ready before reporting to a bank, platform, police service, or fraud agency.
            </p>

            <div className="mt-4 space-y-3">
              {documentPack.map((item) => (
                <div key={item} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-sm leading-6 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Official Reporting Resources</h2>
            <p className="mt-2 text-sm text-gray-600">
              Use official websites for reporting and follow-up. Open the one that fits your case first.
            </p>

            <div className="mt-4 space-y-4">
              {officialResources.map((resource) => (
                <article key={resource.href} className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">{resource.organization}</p>
                  <h3 className="mt-2 text-base font-semibold text-gray-900">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{resource.description}</p>
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Open official site
                  </a>
                </article>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
