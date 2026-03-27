import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

export default function RecoveryCenterPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Recovery Center"
        subtitle="Structured post-incident steps for money, account, and identity recovery after a suspicious interaction."
      />

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">If money was lost</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Contact your bank fraud team immediately and request transaction review.</li>
            <li>Freeze outbound payments and revoke compromised channels.</li>
            <li>Document all transfer references and timestamps.</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">If credentials were exposed</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Change affected passwords immediately and enable multi-factor authentication.</li>
            <li>Review sign-in activity for unknown devices or recovery changes.</li>
            <li>Reset passwords starting with email and banking accounts.</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">If identity data was shared</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Enable credit monitoring alerts through Canadian credit bureaus.</li>
            <li>Review account inquiries and new openings daily.</li>
            <li>Rotate security questions and recovery channels.</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Preserve the case record</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>Keep the original message, screenshots, and attachment names intact.</li>
            <li>Store the report ID, timestamps, and every contact made with institutions.</li>
            <li>Update the private case record as the response progresses.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
