import type { FraudSeverity } from "../types/fraud";

type Props = {
  severity: FraudSeverity;
  riskScore: number;
};

const toneMap: Record<FraudSeverity, string> = {
  "Low Risk": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Medium Risk": "border-amber-200 bg-amber-50 text-amber-700",
  "High Risk": "border-orange-200 bg-orange-50 text-orange-700",
  "Critical Risk": "border-red-200 bg-red-50 text-red-700",
};

export default function SeverityIndicator({ severity, riskScore }: Props) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${toneMap[severity]}`}>
      <span>{severity}</span>
      <span>{riskScore}%</span>
    </div>
  );
}
