import type { FraudAnalysis } from "../types/fraud";
import Card from "./ui/Card";

export default function RiskBreakdown({ analysis }: { analysis: FraudAnalysis | null }) {
  if (!analysis) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900">Why this result was flagged</h3>
      <p className="mt-2 text-sm text-gray-600">
        The score is based on transparent heuristics such as urgency cues, impersonation patterns, credential requests,
        and risky link behavior. These explanations are meant to help the user verify the message independently.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
        {analysis.reasons.map((reason, index) => (
          <li key={`${reason}-${index}`}>{reason}</li>
        ))}
      </ul>
    </Card>
  );
}
