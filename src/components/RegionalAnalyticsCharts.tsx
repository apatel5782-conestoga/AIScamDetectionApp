import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import Card from "./ui/Card";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function RegionalAnalyticsCharts() {
  const barData = {
    labels: ["Ontario", "Quebec", "BC", "Alberta", "Nova Scotia"],
    datasets: [
      {
        label: "Fraud Incidents (30d)",
        data: [318, 289, 201, 174, 88],
        backgroundColor: ["#111827", "#374151", "#4b5563", "#6b7280", "#9ca3af"],
      },
    ],
  };

  const typeDistribution = {
    labels: ["Bank Impersonation", "Investment Fraud", "Identity Theft", "Employment Fraud", "Tech Support"],
    datasets: [
      {
        data: [30, 18, 22, 17, 13],
        backgroundColor: ["#111827", "#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const labelColor = "#4b5563";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">Fraud Frequency by Region</h3>
        <div className="mt-4">
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { labels: { color: labelColor } } }, scales: { x: { ticks: { color: labelColor } }, y: { ticks: { color: labelColor } } } }} />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">Fraud Type Distribution</h3>
        <div className="mx-auto mt-4 max-w-[320px]">
          <Doughnut data={typeDistribution} options={{ responsive: true, plugins: { legend: { labels: { color: labelColor } } } }} />
        </div>
      </Card>
    </div>
  );
}
