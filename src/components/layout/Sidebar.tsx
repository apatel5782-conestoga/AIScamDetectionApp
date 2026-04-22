import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import FraudWatchLogo from "../brand/FraudWatchLogo";

type SidebarItem = {
  label: string;
  to: string;
  adminOnly?: boolean;
  requiresAuth?: boolean;
  icon: "dashboard" | "detect" | "reports" | "recovery" | "legal" | "about" | "admin" | "profile";
};

const links: SidebarItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
  { label: "Analyze", to: "/analyze", icon: "detect" },
  { label: "Reports", to: "/reports", icon: "reports" },
  { label: "Recovery", to: "/recovery", icon: "recovery" },
  { label: "Compliance", to: "/compliance", icon: "legal" },
  { label: "About", to: "/about", icon: "about" },
  { label: "Profile", to: "/profile", requiresAuth: true, icon: "profile" },
  { label: "Admin", to: "/admin", adminOnly: true, icon: "admin" },
];

function NavIcon({ kind }: { kind: SidebarItem["icon"] }) {
  const common = "h-4 w-4";
  switch (kind) {
    case "dashboard":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10zm10 8h8V3h-8v18zM3 21h8v-6H3v6z" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "detect":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "reports":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M7 3h8l4 4v14H7V3zM15 3v4h4" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "recovery":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 108-8" stroke="currentColor" strokeWidth="1.6"/><path d="M4 4v8h8" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "legal":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 3v18m7-14H5m14 10H5" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "about":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 8h.01M11 12h2v5h-2z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "profile":
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zm7 9v-1a6 6 0 00-6-6H11a6 6 0 00-6 6v1" stroke="currentColor" strokeWidth="1.6"/></svg>;
    default:
      return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" stroke="currentColor" strokeWidth="1.6"/></svg>;
  }
}

export default function Sidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <aside className={`relative flex h-full flex-col overflow-hidden ${isDark ? "bg-[linear-gradient(180deg,#020617_0%,#091321_45%,#08111f_100%)]" : "bg-[linear-gradient(180deg,#fffdfa_0%,#f7f4ee_100%)]"}`}>
      {!isDark && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 top-16 h-40 w-40 rounded-full bg-emerald-100/80 blur-3xl" />
          <div className="absolute right-[-2rem] top-36 h-32 w-32 rounded-full bg-amber-100/70 blur-3xl" />
          <div className="absolute left-6 top-[13.5rem] h-[24rem] w-px bg-[linear-gradient(180deg,rgba(16,185,129,0.28),rgba(148,163,184,0.12),transparent)]" />
          <div className="absolute left-5 top-[13rem] h-3.5 w-3.5 rounded-full border border-emerald-400 bg-white" />
          <div className="absolute left-4 top-[21rem] h-5 w-5 rounded-full border border-stone-300 bg-white/90" />
          <div className="absolute left-8 top-[18.5rem] h-44 w-44 rounded-full border border-emerald-200/90" />
          <div className="absolute left-[4.1rem] top-[19.75rem] h-28 w-28 rounded-full border border-amber-200/90" />
          <div className="absolute left-[3.7rem] top-[29rem] h-px w-48 bg-[linear-gradient(90deg,rgba(16,185,129,0.3),transparent)]" />
          <div className="absolute left-[3.7rem] top-[33.5rem] h-px w-40 bg-[linear-gradient(90deg,rgba(245,158,11,0.26),transparent)]" />
          <div className="absolute bottom-24 left-5 h-4 w-4 rounded-full border border-emerald-300 bg-white" />
          <div className="absolute bottom-16 left-9 h-3 w-3 rounded-full bg-amber-300/90" />
          <div className="absolute bottom-10 right-4 h-32 w-32 rounded-full bg-stone-100/95 blur-2xl" />
        </div>
      )}
      <div className={`px-5 py-6 ${isDark ? "border-b border-white/10" : "border-b border-slate-200/80"}`}>
        <div
          className={`relative overflow-hidden rounded-[20px] px-3.5 py-3 ${
            isDark
              ? "border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94)_0%,rgba(15,23,42,0.82)_100%)] shadow-[0_14px_30px_rgba(2,6,23,0.38)]"
              : "border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,248,242,0.96)_100%)] shadow-[0_12px_24px_rgba(15,23,42,0.05)]"
          }`}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className={`absolute -right-10 -top-10 h-20 w-20 rounded-full blur-2xl ${isDark ? "bg-teal-400/22" : "bg-teal-100/60"}`} />
            <div className={`absolute -left-8 bottom-0 h-16 w-16 rounded-full blur-2xl ${isDark ? "bg-sky-400/16" : "bg-sky-100/50"}`} />
            <div className="absolute inset-x-3 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,184,166,0.45),transparent)]" />
          </div>

          <div className="relative">
            <div className={`rounded-2xl p-2.5 ${isDark ? "bg-white shadow-[0_8px_20px_rgba(2,6,23,0.22)] ring-1 ring-white/80" : "bg-white/95 shadow-[0_6px_16px_rgba(15,23,42,0.04)] ring-1 ring-white/80"}`}>
              <FraudWatchLogo widthClassName="w-[190px]" />
            </div>

            <p className={`mt-3 text-xs leading-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Analyze suspicious content and manage reports in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Navigation</p>
      </div>

      <nav className="relative flex-1 space-y-1.5 px-3 py-4">
        {!isDark && (
          <div className="pointer-events-none absolute inset-x-2 top-3 bottom-4 overflow-hidden rounded-[28px]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.14))]" />
            <div className="absolute left-4 top-8 h-36 w-36 rounded-[2rem] border border-white/90 rotate-6" />
            <div className="absolute right-4 top-24 h-28 w-28 rounded-full border border-emerald-200/90" />
            <div className="absolute right-9 top-34 h-px w-24 bg-[linear-gradient(90deg,rgba(16,185,129,0.32),transparent)]" />
            <div className="absolute left-6 bottom-20 h-24 w-24 rounded-full border border-stone-300/90" />
            <div className="absolute left-8 bottom-14 h-px w-28 bg-[linear-gradient(90deg,rgba(245,158,11,0.26),transparent)]" />
          </div>
        )}
        {links
          .filter((link) => !link.adminOnly || user?.role === "admin")
          .filter((link) => !link.requiresAuth || user)
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all duration-300 ${
                  isActive
                    ? isDark
                      ? "bg-[linear-gradient(90deg,rgba(20,184,166,0.18),rgba(20,184,166,0.06))] text-teal-200 shadow-[inset_3px_0_0_0_#14B8A6]"
                      : "border border-emerald-200/80 bg-[linear-gradient(90deg,rgba(16,185,129,0.12),rgba(255,255,255,0.92))] text-emerald-800 shadow-[0_10px_22px_rgba(16,185,129,0.10),inset_3px_0_0_0_#10B981]"
                    : isDark
                      ? "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      : "border border-transparent text-slate-600 hover:border-stone-200/90 hover:bg-white/90 hover:text-slate-900 hover:shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive
                        ? isDark
                          ? "bg-white/12 text-teal-200 shadow-[0_8px_18px_rgba(20,184,166,0.12)]"
                          : "bg-white text-emerald-700 shadow-[0_8px_18px_rgba(16,185,129,0.16)]"
                        : isDark
                          ? "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-200"
                          : "bg-white/80 text-slate-500 ring-1 ring-stone-200/70 group-hover:bg-white group-hover:text-slate-700"
                    }`}
                  >
                    <NavIcon kind={link.icon} />
                  </span>
                  <span className={`font-medium ${isActive ? "font-semibold" : ""}`}>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
