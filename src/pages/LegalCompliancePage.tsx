import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

export default function LegalCompliancePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Legal & Compliance"
        subtitle="Guidance, privacy expectations, and compliance constraints for safe fraud reporting workflows."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Guide to report fraud in Canada</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Preserve evidence records and transaction references.</li>
            <li>Contact your financial institution through verified channels.</li>
            <li>Submit incident details to Canadian Anti-Fraud Centre.</li>
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
          <h2 className="text-xl font-semibold text-gray-900">Privacy Policy (Summary)</h2>
          <p className="mt-3 text-sm text-gray-700">Reports are private, access-controlled, and processed for educational analytics only. Public accusations are prohibited.</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Terms of Service (Summary)</h2>
          <p className="mt-3 text-sm text-gray-700">Users must submit factual, anonymized evidence and accept anti-defamation safeguards.</p>
        </Card>
      </section>

      <Card className="p-6">
        <p className="text-sm text-gray-700">PIPEDA & GDPR notice: data minimization, purpose limitation, controlled retention, and role-based access are applied.</p>
      </Card>
    </div>
  );
}
