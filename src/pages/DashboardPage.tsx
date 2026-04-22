import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import SeverityIndicator from "../components/SeverityIndicator";
import NewsWidget from "../components/NewsWidget";
import { useAuth } from "../context/AuthContext";
import { fetchDashboardData } from "../services/dashboardService";
import type { DashboardData } from "../types/dashboard";

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-36 animate-pulse rounded-2xl border border-gray-100 bg-white" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-gray-100 bg-white" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-white" />
        <div className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-white" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    fetchDashboardData(token)
      .then(setData)
      .catch((loadError: Error) => {
        setError(loadError.message || "Unable to load the dashboard.");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  if (!user) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Fraud triage workspace"
          subtitle="Analyze suspicious messages, document evidence, and prepare private reports with an honest academic workflow."
        />

        <Card className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500">How the app works</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">One clear end-to-end flow</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
                Start with a suspicious message, run a triage analysis, review recommended actions, and convert the
                result into a private report if follow-up is needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/analyze" className="btn-primary">
                Start analysis
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
            </div>
          </div>
        </Card>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <p className="text-xs uppercase tracking-wide text-gray-400">1. Analyze</p>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">Paste suspicious content</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Review risk score, verdict, and transparent heuristics that explain why the content was flagged.
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-wide text-gray-400">2. Report</p>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">Create a private case</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Reuse the triage result so the user does not have to duplicate the incident summary and evidence notes.
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-wide text-gray-400">3. Recover</p>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">Follow guided next steps</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Use recovery and compliance guidance for financial, account, and evidence-preservation follow-up.
            </p>
          </Card>
        </section>
      </div>
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <Card className="p-8">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard unavailable</h2>
        <p className="mt-2 text-sm text-gray-600">{error ?? "No dashboard data available."}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My triage dashboard"
        subtitle="A truthful summary of your saved analyses, submitted reports, and active case work."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <Card key={metric.label} className="p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{metric.value}</p>
            <p className="mt-2 text-sm text-gray-600">{metric.helperText}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent analyses</h2>
              <p className="mt-1 text-sm text-gray-600">Latest triage sessions tied to your account.</p>
            </div>
            <Link to="/analyze" className="btn-secondary !px-3 !py-2 !text-xs">
              New analysis
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {data.recentAnalyses.length === 0 && <p className="text-sm text-gray-500">No saved analyses yet.</p>}
            {data.recentAnalyses.map((analysis) => (
              <article key={analysis.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{analysis.fraudType}</p>
                    <p className="mt-1 text-sm text-gray-600">{analysis.message.slice(0, 140)}</p>
                  </div>
                  <SeverityIndicator severity={analysis.severity} riskScore={analysis.riskScore} />
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent reports</h2>
              <p className="mt-1 text-sm text-gray-600">Private case records created from your triage workflow.</p>
            </div>
            <Link to="/reports" className="btn-secondary !px-3 !py-2 !text-xs">
              View reports
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {data.recentReports.length === 0 && <p className="text-sm text-gray-500">No reports submitted yet.</p>}
            {data.recentReports.map((report) => (
              <article key={report._id} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{report.title}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {report.fraudType} | {report.channel} | {report.severity}
                    </p>
                  </div>
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                    {report.status.replace(/_/g, " ")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <NewsWidget />
    </div>
  );
}
