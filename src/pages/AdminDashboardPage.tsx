import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import { eventLogger } from "../utils/eventLogger";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const events = eventLogger.getAll();

  const chartData = {
    labels: ["Low", "Medium", "High", "Critical"],
    datasets: [
      {
        label: "Escalation Count",
        data: [
          events.filter((event) => event.severity === "Low Risk").length,
          events.filter((event) => event.severity === "Medium Risk").length,
          events.filter((event) => event.severity === "High Risk").length,
          events.filter((event) => event.severity === "Critical Risk").length,
        ],
        backgroundColor: ["#9ca3af", "#6b7280", "#374151", "#111827"],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Admin" subtitle={`Signed in as ${user?.name} (${user?.role})`} />

      <section className="grid gap-6 md:grid-cols-4">
        <Card className="p-6"><p className="text-xs uppercase tracking-[0.14em] text-gray-500">Submitted Reports</p><p className="mt-3 text-3xl font-semibold text-gray-900">42</p></Card>
        <Card className="p-6"><p className="text-xs uppercase tracking-[0.14em] text-gray-500">Pending Review</p><p className="mt-3 text-3xl font-semibold text-gray-900">11</p></Card>
        <Card className="p-6"><p className="text-xs uppercase tracking-[0.14em] text-gray-500">Flagged Patterns</p><p className="mt-3 text-3xl font-semibold text-gray-900">8</p></Card>
        <Card className="p-6"><p className="text-xs uppercase tracking-[0.14em] text-gray-500">Escalation Logs</p><p className="mt-3 text-3xl font-semibold text-gray-900">{events.length}</p></Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Severity Analytics</h2>
          <div className="mt-4"><Bar data={chartData} options={{ plugins: { legend: { labels: { color: "#4b5563" } } }, scales: { x: { ticks: { color: "#6b7280" } }, y: { ticks: { color: "#6b7280" } } } }} /></div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent System Logs</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {events.slice(0, 8).map((event) => (
              <p key={event.id} className="rounded-lg border border-gray-200 bg-white p-2">
                {event.action} | {event.severity} | {event.riskScore}% | {new Date(event.timestamp).toLocaleString()}
              </p>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
