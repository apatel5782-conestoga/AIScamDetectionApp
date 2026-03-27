import { useMemo, useRef, useState } from "react";
import { fraudAnalysisService } from "../services/FraudAnalysisService";
import type { FraudAnalysis, ReportToAuthoritiesResponse } from "../types/fraud";
import { eventLogger } from "../utils/eventLogger";
import Card from "./ui/Card";
import EventLogPanel from "./EventLogPanel";
import RiskBreakdown from "./RiskBreakdown";
import RiskFactorVisualization from "./RiskFactorVisualization";
import SecurityRecommendations from "./SecurityRecommendations";
import SeverityIndicator from "./SeverityIndicator";

export default function FraudAnalysisCard() {
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<FraudAnalysis | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportResponse, setReportResponse] = useState<ReportToAuthoritiesResponse | null>(null);
  const isSubmittingRef = useRef(false);

  const wordCount = useMemo(() => message.trim().split(/\s+/).filter(Boolean).length, [message]);

  const runAnalysis = () => {
    if (!message.trim()) {
      setAnalysis(null);
      return;
    }

    setReportResponse(null);
    setAnalysis(fraudAnalysisService.analyzeMessage(message));
  };

  const handleEscalation = async () => {
    if (!analysis || analysis.severity !== "Critical Risk" || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsReporting(true);

    try {
      const response = await fraudAnalysisService.reportToAuthorities({
        analysisId: analysis.id,
        summary: analysis.message,
        riskScore: analysis.riskScore,
        severity: analysis.severity,
      });
      setReportResponse(response);
    } finally {
      setIsReporting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Fraud Detection Engine</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">Rule-Based Detection Workflow</h2>
            <p className="mt-2 text-sm text-gray-600">Weighted scoring, confidence percentage, and legal-safe escalation guidance.</p>
          </div>
          {analysis && <SeverityIndicator severity={analysis.severity} riskScore={analysis.riskScore} />}
        </div>

        <textarea
          className="form-input mt-5 min-h-[170px]"
          placeholder="Paste suspicious email, message, or chat content..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>{wordCount} words</span>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => {
              setMessage("");
              setAnalysis(null);
              setReportResponse(null);
            }}
          >
            Clear
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={runAnalysis}>
            Analyze Fraud
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setMessage(
                "URGENT NOTICE: Your account is locked. Verify immediately via https://bank-security-review.example and provide OTP code.",
              )
            }
          >
            Load Example
          </button>
        </div>

        {analysis && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900">Confidence Overview</h3>
              <p className="mt-2 text-sm text-gray-700">Confidence: {analysis.confidence}%</p>
              <p className="text-sm text-gray-700">Verdict: {analysis.verdict}</p>
              <p className="text-sm text-gray-700">Severity: {analysis.severity}</p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900">Risk Factors</h3>
              <div className="mt-3">
                <RiskFactorVisualization factors={analysis.riskFactors} />
              </div>
            </Card>
          </div>
        )}

        {analysis?.severity === "Critical Risk" && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p className="font-semibold">This fraud attempt may require legal reporting.</p>
            <button type="button" onClick={handleEscalation} className="mt-3 btn-secondary" disabled={isReporting || isSubmittingRef.current}>
              {isReporting ? "Reporting..." : "Report to Authorities"}
            </button>
            {reportResponse && reportResponse.referenceId !== "DUPLICATE_BLOCKED" && (
              <p className="mt-2 text-xs text-gray-700">
                {reportResponse.destination} | Reference: {reportResponse.referenceId}
              </p>
            )}
          </div>
        )}

        {analysis?.severity === "High Risk" && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
            High risk detected. Contact your bank or financial institution using official channels.
          </div>
        )}
      </Card>

      <RiskBreakdown analysis={analysis} />
      <SecurityRecommendations analysis={analysis} />
      <EventLogPanel events={eventLogger.getAll()} />
    </div>
  );
}
