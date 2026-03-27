import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import type { FraudReport, FraudReportStatus } from "../models/FraudReport";
import {
  fetchAdminAnalytics,
  fetchAdminReports,
  updateAdminReportStatus,
  type AdminAnalytics,
} from "../services/adminService";

const statusOptions: FraudReportStatus[] = [
  "pending",
  "under_review",
  "needs_more_info",
  "escalated",
  "closed",
];

function formatStatus(status: FraudReportStatus) {
  return status.replace(/_/g, " ");
}

function statusTone(status: FraudReportStatus) {
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

export default function AdminDashboardPage() {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [draftStatuses, setDraftStatuses] = useState<Record<string, FraudReportStatus>>({});
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    Promise.all([fetchAdminAnalytics(token), fetchAdminReports(token)])
      .then(([analyticsResponse, reportsResponse]) => {
        setAnalytics(analyticsResponse);
        setReports(reportsResponse);
        setDraftStatuses(
          Object.fromEntries(
            reportsResponse
              .filter((report) => report._id)
              .map((report) => [report._id!, report.status]),
          ),
        );
        setDraftNotes(
          Object.fromEntries(
            reportsResponse
              .filter((report) => report._id)
              .map((report) => [report._id!, report.adminNotes || ""]),
          ),
        );
      })
      .catch((loadError: Error) => {
        setError(loadError.message || "Unable to load admin data.");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleSave = async (reportId: string) => {
    if (!token) return;

    try {
      setSavingIds((current) => ({ ...current, [reportId]: true }));
      const updated = await updateAdminReportStatus(token, reportId, {
        status: draftStatuses[reportId],
        adminNotes: draftNotes[reportId],
      });

      setReports((current) => current.map((report) => (report._id === reportId ? updated : report)));
      setAnalytics(await fetchAdminAnalytics(token));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update report.");
    } finally {
      setSavingIds((current) => ({ ...current, [reportId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-white" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl border border-gray-100 bg-white" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <h2 className="text-lg font-semibold text-gray-900">Admin dashboard unavailable</h2>
        <p className="mt-2 text-sm text-gray-600">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin review queue"
        subtitle={`Signed in as ${user?.name} (${user?.role}). Review private reports and move cases through the triage lifecycle.`}
      />

      {analytics && (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Total reports</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{analytics.totalReports}</p>
            <p className="mt-2 text-sm text-gray-600">All private case records</p>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Pending or review</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{analytics.pending + analytics.underReview}</p>
            <p className="mt-2 text-sm text-gray-600">Cases still moving through review</p>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Escalated cases</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{analytics.escalated}</p>
            <p className="mt-2 text-sm text-gray-600">Cases requiring urgent follow-up</p>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Saved analyses</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{analytics.analyses}</p>
            <p className="mt-2 text-sm text-gray-600">Triage sessions generated by users</p>
          </Card>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Case queue</h2>
              <p className="mt-1 text-sm text-gray-600">Update report status and store internal notes for the review trail.</p>
            </div>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
              {reports.length} reports
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {reports.length === 0 && <p className="text-sm text-gray-500">No reports available.</p>}
            {reports.map((report) => (
              <article key={report._id} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {report.fraudType} | {report.channel} | {report.severity}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(report.status)}`}>
                    {formatStatus(report.status)}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-700">{report.description}</p>

                <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr_auto]">
                  <select
                    className="form-input"
                    value={draftStatuses[report._id || ""] || report.status}
                    onChange={(event) =>
                      setDraftStatuses((current) => ({
                        ...current,
                        [report._id || ""]: event.target.value as FraudReportStatus,
                      }))
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>

                  <textarea
                    className="form-input min-h-[88px]"
                    value={draftNotes[report._id || ""] || ""}
                    onChange={(event) =>
                      setDraftNotes((current) => ({
                        ...current,
                        [report._id || ""]: event.target.value,
                      }))
                    }
                    placeholder="Internal notes for the review trail"
                  />

                  <button
                    type="button"
                    className="btn-primary self-start"
                    onClick={() => report._id && handleSave(report._id)}
                    disabled={!report._id || savingIds[report._id]}
                  >
                    {report._id && savingIds[report._id] ? "Saving..." : "Save"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent system log</h2>
          <p className="mt-1 text-sm text-gray-600">Latest review and analysis activity recorded by the backend.</p>
          <div className="mt-5 space-y-3">
            {analytics?.logs.length === 0 && <p className="text-sm text-gray-500">No log entries yet.</p>}
            {analytics?.logs.map((log) => (
              <article key={log._id || `${log.type}-${log.createdAt}`} className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-semibold text-gray-900">{log.type}</p>
                <p className="mt-2 text-sm leading-6 text-gray-700">{log.message}</p>
                {log.createdAt && <p className="mt-2 text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</p>}
              </article>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
