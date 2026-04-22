import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import FraudWatchLogo from "../brand/FraudWatchLogo";
import ThemeToggle from "../ui/ThemeToggle";
import PremiumButton from "../ui/PremiumButton";
import Sidebar from "./Sidebar";
import ChatBot from "../ChatBot";

function getPageLabel(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  return pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/-/g, " "))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");
}

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-900">
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute left-[-10%] top-[-6%] h-[26rem] w-[26rem] rounded-full blur-3xl ${isDark ? "bg-emerald-500/16" : "bg-emerald-200/28"}`} />
        <div className={`absolute right-[-8%] top-[10%] h-[22rem] w-[22rem] rounded-full blur-3xl ${isDark ? "bg-amber-400/8" : "bg-amber-100/26"}`} />
        <div className={`absolute bottom-[-10%] left-[20%] h-[20rem] w-[20rem] rounded-full blur-3xl ${isDark ? "bg-teal-400/10" : "bg-stone-200/35"}`} />
        <div className={`absolute inset-0 ${isDark ? "bg-[linear-gradient(115deg,rgba(255,255,255,0.02)_0%,transparent_32%,transparent_68%,rgba(16,185,129,0.05)_100%)]" : "bg-[linear-gradient(115deg,rgba(255,255,255,0.34)_0%,transparent_32%,transparent_68%,rgba(16,185,129,0.04)_100%)]"}`} />
        {isDark && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.07),transparent_24%)]" />
            <div className="absolute left-[6%] top-[8rem] h-[18rem] w-[18rem] rounded-full border border-emerald-400/10 shadow-[0_0_120px_rgba(16,185,129,0.05)]" />
            <div className="absolute left-[10%] top-[12rem] h-[10rem] w-[10rem] rounded-full border border-white/5" />
            <div className="absolute right-[8%] top-[18%] h-[16rem] w-[16rem] rounded-[2.5rem] border border-white/6 rotate-12" />
            <div className="absolute right-[12%] top-[22%] h-[8rem] w-[8rem] rounded-[1.75rem] border border-amber-300/8 rotate-12" />
            <div className="absolute bottom-[14%] left-[28%] h-px w-[22rem] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />
            <div className="absolute bottom-[14%] left-[28%] h-[22rem] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.10),transparent)]" />
            <div className="absolute right-[14%] bottom-[12%] h-24 w-24 rounded-full border border-teal-300/10" />
            <div className="absolute right-[17%] bottom-[15%] h-10 w-10 rounded-full bg-emerald-400/10 blur-xl" />
            <div className="hidden xl:block">
              <img
                src="/dark-fraud-radar.svg"
                alt=""
                aria-hidden="true"
                className="absolute right-[2%] top-[5.5rem] w-[26rem] rotate-[6deg] opacity-[0.18] drop-shadow-[0_24px_48px_rgba(2,6,23,0.35)]"
              />
              <img
                src="/dark-fraud-shield.svg"
                alt=""
                aria-hidden="true"
                className="absolute left-[6%] top-[18rem] w-[18rem] rotate-[-10deg] opacity-[0.16] drop-shadow-[0_22px_42px_rgba(2,6,23,0.28)]"
              />
              <img
                src="/dark-fraud-alert.svg"
                alt=""
                aria-hidden="true"
                className="absolute bottom-[4%] right-[10%] w-[14rem] rotate-[-10deg] opacity-[0.12] drop-shadow-[0_22px_40px_rgba(2,6,23,0.28)]"
              />
            </div>
          </>
        )}
        {!isDark && (
          <>
            <div className="hidden xl:block">
              <div className="absolute left-[2%] top-[10rem] h-[20rem] w-[20rem] rounded-full bg-emerald-100/55 blur-3xl" />
              <div className="absolute left-[4%] top-[14rem] h-[12rem] w-[12rem] rounded-full border border-emerald-200/60" />
              <div className="absolute left-[9%] top-[19rem] h-[7rem] w-[7rem] rounded-[2rem] border border-amber-200/60 rotate-12" />
              <div className="absolute left-[18%] top-[24rem] h-px w-[10rem] bg-[linear-gradient(90deg,rgba(16,185,129,0.25),transparent)]" />
              <img
                src="/light-security-shield.svg"
                alt=""
                aria-hidden="true"
                className="absolute left-[3.5%] top-[13rem] w-[16rem] rotate-[-10deg] opacity-[0.18] drop-shadow-[0_24px_40px_rgba(15,23,42,0.06)]"
              />
              <div className="absolute right-[3%] top-[8.5rem] h-[24rem] w-[24rem] rounded-full bg-white/48 blur-3xl" />
              <img
                src="/light-security-monitor.svg"
                alt=""
                aria-hidden="true"
                className="absolute right-[3.5%] top-[7.5rem] w-[22rem] rotate-[-6deg] opacity-[0.22] drop-shadow-[0_30px_50px_rgba(15,23,42,0.08)]"
              />
              <img
                src="/light-security-shield.svg"
                alt=""
                aria-hidden="true"
                className="absolute right-[20%] top-[23rem] w-[16rem] rotate-[8deg] opacity-[0.18] drop-shadow-[0_20px_35px_rgba(15,23,42,0.06)]"
              />
              <img
                src="/light-security-alert.svg"
                alt=""
                aria-hidden="true"
                className="absolute bottom-[7%] right-[6%] w-[15rem] rotate-[-8deg] opacity-[0.16] drop-shadow-[0_18px_34px_rgba(15,23,42,0.06)]"
              />
              <div className="absolute bottom-[10%] left-[28%] h-24 w-24 rounded-full border border-stone-200/80" />
              <div className="absolute bottom-[12%] left-[31%] h-8 w-8 rounded-full bg-emerald-200/70 blur-xl" />
            </div>
          </>
        )}
      </div>
      {open && (
        <button
          type="button"
          className={`fixed inset-0 z-30 lg:hidden ${isDark ? "bg-black/35" : "bg-black/15"}`}
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 backdrop-blur-xl transition-transform lg:translate-x-0 ${
          isDark ? "border-r border-white/10 bg-slate-950/88" : "border-r border-white/60 bg-white/80"
        } ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      <div className="relative lg:pl-72">
        <header className={`sticky top-0 z-20 backdrop-blur-xl ${isDark ? "border-b border-white/10 bg-slate-950/70" : "border-b border-white/60 bg-white/68"}`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg lg:hidden ${isDark ? "border border-white/15 text-slate-200" : "border border-gray-300 text-gray-700"}`}
                onClick={() => setOpen(true)}
                aria-label="Open sidebar"
              >
                <span className={`h-0.5 w-4 ${isDark ? "bg-slate-200" : "bg-gray-700"}`} />
              </button>
              <Link to="/analyze" className="hidden sm:block">
                <FraudWatchLogo widthClassName="w-[210px]" />
              </Link>
              <div className={`hidden h-10 w-px sm:block ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
              <div>
                <p className={`text-xs uppercase tracking-[0.14em] ${isDark ? "text-slate-400" : "text-gray-500"}`}>Triage Workspace</p>
                <p className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-gray-800"}`}>{getPageLabel(location.pathname)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <>
                  <p className={`hidden text-sm sm:block ${isDark ? "text-slate-400" : "text-gray-500"}`}>{user.name}</p>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className={`hidden sm:block rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        isDark
                          ? "border border-teal-400/20 bg-teal-500/12 text-teal-200 hover:bg-teal-500/18"
                          : "border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className="btn-secondary !px-3 !py-2 !text-xs">
                    Profile
                  </Link>
                  <PremiumButton
                    className="!px-3 !py-2 !text-xs"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Log out
                  </PremiumButton>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary !px-3 !py-2 !text-xs">
                    Log in
                  </Link>
                  <Link to="/signup" className="btn-primary !px-3 !py-2 !text-xs">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className={`mx-auto max-w-7xl px-8 py-10 ${isDark ? "" : "theme-content-light"}`}>
          <div className="space-y-8 fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Chatbot — available on all pages */}
      <ChatBot />
    </div>
  );
}
