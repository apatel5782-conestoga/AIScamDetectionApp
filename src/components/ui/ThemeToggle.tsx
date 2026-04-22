import { useTheme } from "../../context/ThemeContext";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7.2 7.2 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold backdrop-blur-xl transition ${
        isDark
          ? "border border-white/10 bg-slate-950/82 text-white shadow-[0_16px_36px_rgba(2,6,23,0.35)] hover:bg-slate-900"
          : "border border-slate-200 bg-white/85 text-slate-800 shadow-[0_16px_36px_rgba(15,23,42,0.12)] hover:bg-white"
      }`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className={`flex h-7 w-7 items-center justify-center rounded-full ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
