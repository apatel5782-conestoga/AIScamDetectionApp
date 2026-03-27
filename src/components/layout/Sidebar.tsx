import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type SidebarItem = {
  label: string;
  to: string;
  adminOnly?: boolean;
  requiresAuth?: boolean;
  icon: "dashboard" | "detect" | "reports" | "recovery" | "legal" | "about" | "admin" | "profile";
};

const links: SidebarItem[] = [
  { label: "Dashboard", to: "/", icon: "dashboard" },
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

  return (
    <aside className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 px-5 py-6">
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Academic Triage App</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">AI-Assisted Fraud Triage and Reporting</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links
          .filter((link) => !link.adminOnly || user?.role === "admin")
          .filter((link) => !link.requiresAuth || user)
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-r-xl border-l-2 px-3 py-2 text-sm transition-all duration-300 ${
                  isActive
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <NavIcon kind={link.icon} />
              <span>{link.label}</span>
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
