import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

export default function LegalCompliancePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Compliance and safe use"
        subtitle="Privacy expectations, evidence handling guidance, and boundaries for an academic fraud triage workflow."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Private reporting principles</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Reports remain access-controlled and are not posted publicly.</li>
            <li>Users should avoid naming or accusing people in public-facing spaces.</li>
            <li>Case records are for documentation and review, not public judgment.</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Evidence preservation guide</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Capture full email headers, SMS logs, call records, and URLs.</li>
            <li>Record timeline of events and actions taken.</li>
            <li>Store files with controlled access and immutable history where possible.</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">AI use disclosure</h2>
          <p className="mt-3 text-sm text-gray-700">
            The analysis output is AI-assisted and heuristic. It may miss context or overstate risk, so users should
            verify through official channels before acting.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Academic scope</h2>
          <p className="mt-3 text-sm text-gray-700">
            This project demonstrates a software workflow for triage and reporting. It is not a substitute for legal,
            regulatory, or forensic services.
          </p>
        </Card>
      </section>

      <Card className="p-6">
        <p className="text-sm text-gray-700">
          Privacy and retention are modeled around data minimization, purpose limitation, and role-based access. Users
          should still avoid uploading unnecessary personal information.
        </p>
      </Card>
    </div>
  );
}
