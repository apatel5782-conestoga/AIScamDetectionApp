import type { FraudAnalysis } from "../types/fraud";
import Card from "./ui/Card";

type Props = {
  analysis: FraudAnalysis | null;
};

export default function SecurityRecommendations({ analysis }: Props) {
  if (!analysis) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900">What To Do Next</h3>
      <p className="mt-2 text-sm text-gray-600">
        This response plan is tailored to the current case so the user knows what to do after a suspicious email, text, phone call, file, or link.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {analysis.recommendedActions.map((action) => (
          <article key={`${action.priority}-${action.title}`} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-gray-900">{action.title}</h4>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  action.priority === "now"
                    ? "bg-red-50 text-red-700"
                    : action.priority === "soon"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {action.priority}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-700">{action.description}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
