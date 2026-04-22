import { useTheme } from "../../context/ThemeContext";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { isDark } = useTheme();

  return (
    <header
      className={`relative overflow-hidden rounded-[28px] px-6 py-6 backdrop-blur-xl ${
        isDark
          ? "border border-white/10 bg-slate-950/56 shadow-[0_16px_40px_rgba(2,6,23,0.28)]"
          : "border border-white/70 bg-white/55 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-8 top-0 h-24 w-24 rounded-full blur-2xl ${isDark ? "bg-teal-400/20" : "bg-teal-100/55"}`} />
        <div className={`absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl ${isDark ? "bg-sky-400/16" : "bg-sky-100/40"}`} />
      </div>
      <div className="relative">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isDark ? "text-teal-300" : "text-teal-700"}`}>FraudWatch Workspace</p>
        <h1 className={`mt-3 text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h1>
        {subtitle && <p className={`mt-2 max-w-4xl text-lg leading-8 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{subtitle}</p>}
      </div>
    </header>
  );
}
