import { useEffect, useState } from "react";
import ChartContainer from "../components/dashboard/ChartContainer";
import KpiCard from "../components/dashboard/KpiCard";
import RegionBarChart from "../components/dashboard/RegionBarChart";
import RiskDonutChart from "../components/dashboard/RiskDonutChart";
import TrendLineChart from "../components/dashboard/TrendLineChart";
import Card from "../components/ui/Card";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import PremiumButton from "../components/ui/PremiumButton";
import SectionHeader from "../components/ui/SectionHeader";
import { fetchDashboardData } from "../services/dashboardService";
import type { DashboardData } from "../types/dashboard";

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-[200px] animate-pulse rounded-2xl border border-gray-100 bg-white" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-gray-100 bg-white" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="h-[280px] animate-pulse rounded-2xl border border-gray-100 bg-white" />
        <div className="h-[280px] animate-pulse rounded-2xl border border-gray-100 bg-white" />
        <div className="h-[280px] animate-pulse rounded-2xl border border-gray-100 bg-white" />
      </div>
    </div>
  );
}

function DashboardError({ message }: { message: string }) {
  return (
    <Card className="p-8">
      <h2 className="text-lg font-semibold text-gray-900">Dashboard unavailable</h2>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const dashboardData = await fetchDashboardData(controller.signal);
        setData(dashboardData);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return <DashboardError message={error ?? "No dashboard data available."} />;
  }

  return (
    <ErrorBoundary fallback={<DashboardError message="Something went wrong while rendering the dashboard." />}>
      <div className="space-y-8">
        <Card className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{data.heroTitle}</h1>
              <p className="mt-3 max-w-3xl text-lg text-gray-600">{data.heroSubtitle}</p>
            </div>
            <PremiumButton className="mt-1">Run New Analysis</PremiumButton>
          </div>
        </Card>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data.kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Analytics" subtitle="Live fraud monitoring and distribution insights" />
          <div className="grid gap-6 xl:grid-cols-3">
            <ChartContainer title="Fraud Trend" subtitle="Monthly anomaly trajectory">
              <TrendLineChart trend={data.trend} />
            </ChartContainer>

            <ChartContainer title="Region Distribution" subtitle="Case volume by province">
              <RegionBarChart />
            </ChartContainer>

            <ChartContainer title="Risk Breakdown" subtitle="Current severity ratio">
              <RiskDonutChart />
            </ChartContainer>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Activity Feed" subtitle="Recent platform alerts and analyst actions" />
          <Card className="p-6">
            <div className="space-y-3">
              {data.alerts.map((alert, index) => (
                <article key={alert.id} className="flex items-start gap-3 rounded-2xl border border-gray-100 p-4">
                  <div className={`mt-0.5 grid h-9 w-9 place-items-center rounded-full text-xs font-semibold ${alert.severity === "Critical" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-800">{alert.id}</p>
                      <p className="text-xs text-gray-500">{alert.date}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{alert.message}</p>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </ErrorBoundary>
  );
}
