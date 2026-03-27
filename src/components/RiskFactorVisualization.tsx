import type { RiskFactor } from "../types/fraud";

type Props = {
  factors: RiskFactor[];
};

export default function RiskFactorVisualization({ factors }: Props) {
  return (
    <div className="space-y-3">
      {factors.map((factor) => (
        <div key={factor.key}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-600">{factor.label}</span>
            <span className="text-gray-700">{factor.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-gray-900" style={{ width: `${factor.value}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-gray-500">{factor.description}</p>
        </div>
      ))}
    </div>
  );
}
