import { Link, NavLink } from "react-router-dom";

const navItemClassName = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${isActive ? "text-[#0f4c81] font-semibold" : "text-slate-600 hover:text-[#0f4c81]"}`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0f4c81] to-[#f97316]" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Shield Network</p>
            <span className="font-semibold text-slate-900">AI Scam Detector</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink className={navItemClassName} to="/">
            Home
          </NavLink>
          <NavLink className={navItemClassName} to="/feed">
            Community Feed
          </NavLink>
          <NavLink className={navItemClassName} to="/profile">
            Profile
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-secondary">
            Log In
          </Link>
          <Link to="/signup" className="btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
