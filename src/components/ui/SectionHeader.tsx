import { useTheme } from "../../context/ThemeContext";

export default function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-4 rounded-2xl px-5 py-4 backdrop-blur ${
        isDark
          ? "border border-white/10 bg-slate-950/48 shadow-[0_12px_28px_rgba(2,6,23,0.24)]"
          : "border border-white/70 bg-white/45 shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
      }`}
    >
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h2>
        {subtitle && <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
