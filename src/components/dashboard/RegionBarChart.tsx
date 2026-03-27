import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { memo, useMemo } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function RegionBarChartComponent() {
  const data = useMemo(
    () => ({
      labels: ["Ontario", "Quebec", "BC", "Alberta", "Nova Scotia"],
      datasets: [
        {
          label: "Regional Cases",
          data: [318, 289, 201, 174, 88],
          backgroundColor: "#4f46e5",
          borderRadius: 10,
        },
      ],
    }),
    [],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#4b5563" } } },
      scales: {
        x: { ticks: { color: "#6b7280" }, grid: { display: false } },
        y: { ticks: { color: "#6b7280" }, grid: { color: "#f3f4f6" } },
      },
    }),
    [],
  );

  return <Bar data={data} options={options} />;
}

const RegionBarChart = memo(RegionBarChartComponent);
export default RegionBarChart;
