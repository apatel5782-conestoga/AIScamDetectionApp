import type { FraudAnalysis } from "../types/fraud";
import Card from "./ui/Card";

export default function RiskBreakdown({ analysis }: { analysis: FraudAnalysis | null }) {
  if (!analysis) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900">Risk Breakdown Explanation</h3>
      <p className="mt-2 text-sm text-gray-600">
        Confidence score is derived from weighted indicators: manipulation, urgency, URL patterns, and impersonation signals.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
        {analysis.reasons.map((reason, index) => (
          <li key={`${reason}-${index}`}>{reason}</li>
        ))}
      </ul>
    </Card>
  );
}
