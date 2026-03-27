import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { memo, useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { DashboardTrendPoint } from "../../types/dashboard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function TrendLineChartComponent({ trend }: { trend: DashboardTrendPoint[] }) {
  const data = useMemo(
    () => ({
      labels: trend.map((point) => point.month),
      datasets: [
        {
          label: "Fraud Trend",
          data: trend.map((point) => point.value),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.08)",
          fill: true,
          tension: 0.35,
          pointRadius: 2.5,
        },
      ],
    }),
    [trend],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      plugins: { legend: { labels: { color: "#4b5563" } } },
      scales: {
        x: { ticks: { color: "#6b7280" }, grid: { color: "#eff6ff" } },
        y: { ticks: { color: "#6b7280" }, grid: { color: "#f3f4f6" } },
      },
    }),
    [],
  );

  return <Line data={data} options={options} />;
}

const TrendLineChart = memo(TrendLineChartComponent);
export default TrendLineChart;
