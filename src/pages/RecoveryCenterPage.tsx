import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

export default function RecoveryCenterPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Recovery Center"
        subtitle="Structured post-incident response steps for financial and identity recovery."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">What to do if money was lost</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Contact your bank fraud team immediately and request transaction review.</li>
            <li>Freeze outbound payments and revoke compromised channels.</li>
            <li>Document all transfer references and timestamps.</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">How to contact bank</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Use card-back number or official website contact only.</li>
            <li>Request account lockdown and credential reset.</li>
            <li>Ask for fraud case reference and escalation timeline.</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">How to freeze credit</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Enable credit monitoring alerts through Canadian credit bureaus.</li>
            <li>Review account inquiries and new openings daily.</li>
            <li>Rotate security questions and recovery channels.</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">How to report identity theft</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>File police report with preserved evidence package.</li>
            <li>Report to Canadian Anti-Fraud Centre (placeholder link).</li>
            <li>Notify all impacted institutions and providers.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
