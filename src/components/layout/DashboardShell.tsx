import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type NavItem = {
  label: string;
  to: string;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/" },
  { label: "Detect Fraud", to: "/fraud-detection" },
  { label: "Location Intelligence", to: "/fraud-map" },
  { label: "Reports Center", to: "/fraud-reporting" },
  { label: "Community Hub", to: "/community-hub" },
  { label: "Recovery Center", to: "/recovery-center" },
  { label: "Legal & Compliance", to: "/legal-compliance" },
  { label: "Admin", to: "/admin", adminOnly: true },
];

function breadcrumbFromPath(pathname: string): string {
  if (pathname === "/") return "Dashboard";

  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, " "))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");
}

export default function DashboardShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const visibleItems = useMemo(
    () => navItems.filter((item) => !item.adminOnly || user?.role === "admin"),
    [user?.role],
  );

  const breadcrumb = breadcrumbFromPath(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800 bg-slate-950 transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-4 py-5">
          <Link to="/" className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-blue-300">Enterprise Console</p>
            <p className="mt-1 font-display text-sm text-white">AI Fraud Intelligence & Protection System</p>
          </Link>

          <nav className="mt-6 space-y-1">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "sidebar-link-active" : "sidebar-link-idle"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs">
            <p className="text-slate-400">Signed in as</p>
            <p className="mt-1 font-semibold text-slate-100">{user?.name || "Analyst"}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] uppercase tracking-wide text-emerald-300">
                {user?.role || "guest"}
              </span>
              <button type="button" onClick={logout} className="text-[11px] text-slate-300 hover:text-white">
                Log out
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation"
              >
                <span className="h-0.5 w-4 bg-slate-200" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Navigation</p>
                <p className="font-display text-base text-slate-100">{breadcrumb}</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="status-pill status-normal">System Normal</span>
              <span className="status-pill status-medium">3 Medium Warnings</span>
              <span className="status-pill status-critical">1 Critical Alert</span>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
