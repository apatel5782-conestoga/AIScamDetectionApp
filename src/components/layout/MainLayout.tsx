import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PremiumButton from "../ui/PremiumButton";
import Sidebar from "./Sidebar";

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900">
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/15 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-gray-200 bg-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-700 lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open sidebar"
              >
                <span className="h-0.5 w-4 bg-gray-700" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Workspace</p>
                <p className="text-sm font-semibold text-gray-800">{getPageLabel(location.pathname)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <p className="hidden text-sm text-gray-500 sm:block">{user.name}</p>
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

        <main className="mx-auto max-w-7xl px-8 py-10">
          <div className="space-y-8 fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
