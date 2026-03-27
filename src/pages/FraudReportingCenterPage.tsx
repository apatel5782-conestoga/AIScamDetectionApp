import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LegalDisclaimer from "../components/LegalDisclaimer";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import type { FraudReport, FraudReportStatus } from "../models/FraudReport";
import { fraudAnalysisService } from "../services/FraudAnalysisService";
import { generateFraudReportPdf, getMyFraudReports, submitFraudReport } from "../services/fraudReportService";
import type { FraudChannel, FraudSeverity } from "../types/fraud";

type ReportFormState = {
  analysisSessionId?: string;
  title: string;
  description: string;
  evidenceDescription: string;
  fraudType: string;
  channel: FraudChannel;
  amountLost: string;
  severity: FraudSeverity;
  legalDisclaimerAccepted: boolean;
};

function getStatusTone(status: FraudReportStatus) {
  switch (status) {
    case "under_review":
      return "bg-blue-50 text-blue-700";
    case "needs_more_info":
      return "bg-amber-50 text-amber-700";
    case "escalated":
      return "bg-red-50 text-red-700";
    case "closed":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatStatus(status: FraudReportStatus) {
  return status.replace(/_/g, " ");
}

function buildInitialForm(): ReportFormState {
  const latestAnalysis = fraudAnalysisService.loadLatestAnalysis();
  if (!latestAnalysis) {
    return {
      title: "",
      description: "",
      evidenceDescription: "",
      fraudType: "",
      channel: "Email",
      amountLost: "",
      severity: "Medium Risk",
      legalDisclaimerAccepted: false,
    };
  }

  return {
    analysisSessionId: latestAnalysis.id,
    title: latestAnalysis.reportDraft.title,
    description: latestAnalysis.reportDraft.description,
    evidenceDescription: latestAnalysis.reportDraft.evidenceDescription,
    fraudType: latestAnalysis.reportDraft.fraudType,
    channel: latestAnalysis.reportDraft.channel,
    amountLost: "",
    severity: latestAnalysis.reportDraft.severity,
    legalDisclaimerAccepted: false,
  };
}

export default function FraudReportingCenterPage() {
  const { user, token } = useAuth();
  const latestAnalysis = useMemo(() => fraudAnalysisService.loadLatestAnalysis(), []);
  const [form, setForm] = useState<ReportFormState>(buildInitialForm);
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setReports([]);
      return;
    }

    setIsLoadingReports(true);
    getMyFraudReports(token)
      .then(setReports)
      .catch((loadError: Error) => {
        setError(loadError.message || "Unable to load your reports.");
      })
      .finally(() => setIsLoadingReports(false));
  }, [token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Sign in before submitting a private report.");
      return;
    }

    if (!form.legalDisclaimerAccepted) {
      setError("Please confirm the private reporting disclaimer before submitting.");
      return;
    }

    if (!form.analysisSessionId) {
      if (!form.title.trim()) {
        setError("Please add a case title.");
        return;
      }
      if (!form.fraudType.trim()) {
        setError("Please add a fraud type.");
        return;
      }
      if (!form.description.trim()) {
        setError("Please add an incident summary.");
        return;
      }
      if (!form.evidenceDescription.trim()) {
        setError("Please add an evidence summary.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const response = await submitFraudReport(token, {
        analysisSessionId: form.analysisSessionId,
        title: form.title,
        description: form.description,
        evidenceDescription: form.evidenceDescription,
        fraudType: form.fraudType,
        channel: form.channel,
        amountLost: form.amountLost ? Number(form.amountLost) : undefined,
        severity: form.severity,
        legalDisclaimerAccepted: form.legalDisclaimerAccepted,
      });

      setSubmittedId(response.id);
      if (form.analysisSessionId) {
        fraudAnalysisService.clearLatestAnalysis();
      }

      const updatedReports = await getMyFraudReports(token);
      setReports(updatedReports);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePdfDownload = async (reportId: string) => {
    if (!token) return;

    try {
      setDownloadingId(reportId);
      const blob = await generateFraudReportPdf(reportId, token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fraud-report-${reportId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Unable to export this report.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Private reports"
        subtitle="Turn a triage result into a private case record and track the case lifecycle over time."
      />

      <Card className="p-6">
        <LegalDisclaimer />
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card className="p-6">
          {latestAnalysis && (
            <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
              Latest analysis loaded. The form is pre-filled from your most recent triage result so you do not need to
              re-enter the same details.
            </div>
          )}

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <input
              className="form-input"
              placeholder="Case title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="form-input"
                placeholder="Fraud type"
                value={form.fraudType}
                onChange={(event) => setForm({ ...form, fraudType: event.target.value })}
                required
              />
              <select
                className="form-input"
                value={form.channel}
                onChange={(event) => setForm({ ...form, channel: event.target.value as FraudChannel })}
              >
                <option>Email</option>
                <option>SMS</option>
                <option>Phone</option>
                <option>Social Media</option>
                <option>Website</option>
                <option>Other</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <select
                className="form-input"
                value={form.severity}
                onChange={(event) => setForm({ ...form, severity: event.target.value as FraudSeverity })}
              >
                <option>Low Risk</option>
                <option>Medium Risk</option>
                <option>High Risk</option>
                <option>Critical Risk</option>
              </select>
              <input
                className="form-input"
                type="number"
                min={0}
                placeholder="Estimated amount lost (optional)"
                value={form.amountLost}
                onChange={(event) => setForm({ ...form, amountLost: event.target.value })}
              />
            </div>

            <textarea
              className="form-input min-h-[150px]"
              placeholder="Incident summary"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />

            <textarea
              className="form-input min-h-[130px]"
              placeholder="Evidence summary"
              value={form.evidenceDescription}
              onChange={(event) => setForm({ ...form, evidenceDescription: event.target.value })}
              required
            />

            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.legalDisclaimerAccepted}
                onChange={(event) => setForm({ ...form, legalDisclaimerAccepted: event.target.checked })}
              />
              I confirm this report is factual to the best of my knowledge and should remain private within the case
              review workflow.
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {submittedId && <p className="text-sm text-emerald-700">Report submitted successfully. Report ID: {submittedId}</p>}

            {!user && (
              <p className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                Sign in to save the report to your account.
                <Link className="ml-1 font-medium text-gray-900 underline" to="/login">
                  Go to sign in
                </Link>
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" type="submit" disabled={!token || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit private report"}
              </button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">My case history</h2>
              <p className="mt-1 text-sm text-gray-600">Saved reports tied to your account.</p>
            </div>
            {token && (
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
                {reports.length} cases
              </span>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {!token && <p className="text-sm text-gray-500">Sign in to view report history and download PDFs.</p>}
            {token && isLoadingReports && <p className="text-sm text-gray-500">Loading your reports...</p>}
            {token && !isLoadingReports && reports.length === 0 && (
              <p className="text-sm text-gray-500">No reports submitted yet.</p>
            )}
            {reports.map((report) => (
              <article key={report._id} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {report.fraudType} | {report.channel} | {report.severity}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusTone(report.status)}`}>
                    {formatStatus(report.status)}
                  </span>
                </div>
                {report.adminNotes && <p className="mt-3 text-sm text-gray-700">Admin notes: {report.adminNotes}</p>}
                <div className="mt-4 flex flex-wrap gap-3">
                  {report._id && (
                    <button
                      type="button"
                      className="btn-secondary !px-3 !py-2 !text-xs"
                      onClick={() => handlePdfDownload(report._id!)}
                      disabled={downloadingId === report._id}
                    >
                      {downloadingId === report._id ? "Preparing PDF..." : "Download PDF"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
