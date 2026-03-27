import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { memo, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function RiskDonutChartComponent() {
  const data = useMemo(
    () => ({
      labels: ["Low", "Medium", "High", "Critical"],
      datasets: [
        {
          data: [42, 30, 18, 10],
          backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#b91c1c"],
          borderWidth: 0,
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
      cutout: "68%",
    }),
    [],
  );

  return <Doughnut data={data} options={options} />;
}

const RiskDonutChart = memo(RiskDonutChartComponent);
export default RiskDonutChart;
