import type { FraudAnalysis } from "../types/fraud";
import Card from "./ui/Card";
import RiskFactorVisualization from "./RiskFactorVisualization";
import SeverityIndicator from "./SeverityIndicator";

type Props = {
  analysis: FraudAnalysis | null;
  onCreateReport?: () => void;
  reportActionLabel?: string;
  reportActionDisabled?: boolean;
};

export default function FraudAnalysisCard({
  analysis,
  onCreateReport,
  reportActionLabel = "Create private report",
  reportActionDisabled = false,
}: Props) {
  if (!analysis) {
    return null;
  }

  return (
    <Card className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Adaptive Case Intelligence</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Auto-constructed case outcome</h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            The system combined evidence, scam categorization, similar case matching, a report draft, and a dynamic
            recovery playbook into one triage result.
          </p>
        </div>
        <SeverityIndicator severity={analysis.severity} riskScore={analysis.riskScore} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">Case summary</h3>
          <p className="mt-3 text-sm leading-7 text-gray-700">{analysis.triageSummary}</p>

          <dl className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400">Verdict</dt>
              <dd className="mt-1 font-medium text-gray-900">{analysis.verdict}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400">Scam category</dt>
              <dd className="mt-1 font-medium text-gray-900">{analysis.scamCategory}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400">Channel</dt>
              <dd className="mt-1">{analysis.channel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400">Confidence</dt>
              <dd className="mt-1">{analysis.confidence}%</dd>
            </div>
          </dl>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Message reviewed</p>
            <p className="mt-2 text-sm leading-6 text-gray-700">{analysis.message}</p>
          </div>

          {analysis.evidenceSummary && (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">Evidence notes</p>
              <p className="mt-2 text-sm text-gray-700">{analysis.evidenceSummary}</p>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Extracted signals</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.extractedSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>

          {onCreateReport && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-primary" onClick={onCreateReport} disabled={reportActionDisabled}>
                {reportActionLabel}
              </button>
              <p className="text-xs text-gray-500">Use this result to pre-fill a private case report.</p>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">Signal breakdown</h3>
          <div className="mt-4">
            <RiskFactorVisualization factors={analysis.riskFactors} />
          </div>
          <p className="mt-4 text-xs leading-5 text-gray-500">{analysis.safeUseNotice}</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">Similar cases</h3>
              <p className="mt-1 text-sm text-gray-600">Prior cases that share category, channel, or suspicious traits.</p>
            </div>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
              {analysis.similarCases.length} match{analysis.similarCases.length === 1 ? "" : "es"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {analysis.similarCases.length === 0 && (
              <p className="text-sm text-gray-500">No close prior or reference case was found for this evidence set yet.</p>
            )}
            {analysis.similarCases.map((caseMatch) => (
              <article key={caseMatch.caseId} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{caseMatch.title}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {caseMatch.scamCategory} | {caseMatch.channel} | {caseMatch.severity}
                    </p>
                    {caseMatch.caseSummary && (
                      <p className="mt-2 text-sm leading-6 text-gray-700">{caseMatch.caseSummary}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {caseMatch.similarityScore}% similar
                    </span>
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                      {caseMatch.sourceType === "reference_playbook" ? "reference case" : "prior analysis"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {caseMatch.matchingTraits.map((trait) => (
                    <span
                      key={`${caseMatch.caseId}-${trait}`}
                      className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs text-gray-700"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">Generated report draft</h3>
          <p className="mt-1 text-sm text-gray-600">This draft is ready to flow into the private reporting form.</p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Suggested title</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{analysis.reportDraft.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Suggested queue status</p>
              <p className="mt-1 text-sm text-gray-700">{analysis.reportDraft.suggestedStatus.replace(/_/g, " ")}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Draft summary</p>
              <p className="mt-1 text-sm leading-6 text-gray-700 whitespace-pre-line">{analysis.reportDraft.description}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Evidence summary</p>
              <p className="mt-1 text-sm leading-6 text-gray-700">{analysis.reportDraft.evidenceDescription || "No evidence notes supplied."}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">Case timeline</h3>
          <p className="mt-1 text-sm text-gray-600">How the system turned raw evidence into a structured case.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {analysis.caseTimeline.map((event, index) => (
              <article key={event.step} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-700">{event.description}</p>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </Card>
  );
}
