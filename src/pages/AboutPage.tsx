import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="About"
        subtitle="Enterprise-grade academic demonstration for fraud awareness, detection, and recovery workflows."
      />

      <Card className="p-6">
        <p className="text-sm leading-7 text-gray-700">
          AI Fraud Intelligence & Protection System demonstrates a modern SaaS architecture for fraud detection,
          private report workflows, regional intelligence, and compliance-safe recovery guidance.
        </p>
      </Card>
    </div>
  );
}
