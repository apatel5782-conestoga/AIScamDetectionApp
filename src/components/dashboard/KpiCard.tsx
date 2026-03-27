import AnimatedCounter from "./AnimatedCounter";
import Card from "../ui/Card";

type Tone = "brand" | "positive" | "critical";

type Props = {
  label: string;
  value: number;
  trendText: string;
  tone?: Tone;
  icon: "shield" | "alert" | "users" | "confidence" | "pulse" | "risk";
};

function Icon({ kind }: { kind: Props["icon"] }) {
  const common = "h-5 w-5";

  switch (kind) {
    case "shield":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8"/></svg>;
    case "alert":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M4.5 19h15L12 5l-7.5 14z" stroke="currentColor" strokeWidth="1.8"/></svg>;
    case "users":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M16 11a3 3 0 100-6 3 3 0 000 6zM8 12a3 3 0 100-6 3 3 0 000 6zm8 9v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16 0v-1a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.8"/></svg>;
    case "confidence":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M4 18l5-6 4 3 7-8" stroke="currentColor" strokeWidth="1.8"/><path d="M18 7h2v2" stroke="currentColor" strokeWidth="1.8"/></svg>;
    case "pulse":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M3 12h4l2-4 4 8 2-4h6" stroke="currentColor" strokeWidth="1.8"/></svg>;
    default:
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 3v18m9-9H3" stroke="currentColor" strokeWidth="1.8"/></svg>;
  }
}

export default function KpiCard({ label, value, trendText, tone = "brand", icon }: Props) {
  const toneClass = tone === "critical" ? "text-red-600" : tone === "positive" ? "text-emerald-600" : "text-blue-600";

  return (
    <Card className="p-6 fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{label}</p>
          <p className="mt-3 text-4xl font-bold text-gray-900">
            <AnimatedCounter value={value} />
          </p>
          <p className={`mt-2 text-sm font-medium ${toneClass}`}>{trendText}</p>
        </div>
        <div className={`rounded-xl bg-gray-50 p-2 ${toneClass}`}>
          <Icon kind={icon} />
        </div>
      </div>
    </Card>
  );
}
