import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="About"
        subtitle="An academic full-stack project focused on explainable fraud triage, private reporting, and guided recovery steps."
      />

      <Card className="p-6">
        <p className="text-sm leading-7 text-gray-700">
          AI-Assisted Fraud Triage and Reporting helps a user review suspicious messages, document evidence, and prepare
          a private case report for follow-up. The analysis layer is intentionally framed as heuristic decision support,
          not as production-grade detection or legal proof.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900">What makes this version stronger</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>One coherent user journey from analysis to reporting.</li>
          <li>Honest academic framing around AI-assisted heuristics.</li>
          <li>Private case management instead of public accusation workflows.</li>
        </ul>
      </Card>
    </div>
  );
}
