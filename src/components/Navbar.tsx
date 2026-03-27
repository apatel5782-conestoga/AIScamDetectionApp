import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItemClassName = ({ isActive }: { isActive: boolean }) =>
  `text-xs uppercase tracking-wide transition ${isActive ? "text-white" : "text-neutral-400 hover:text-neutral-100"}`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-blue-400/40 bg-blue-500/20 font-display text-lg text-white">AI</div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">Enterprise Suite</p>
            <p className="font-display text-sm text-white">AI Fraud Intelligence & Protection System</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
          <NavLink className={navItemClassName} to="/fraud-detection">Detection</NavLink>
          <NavLink className={navItemClassName} to="/fraud-map">Location Risk</NavLink>
          <NavLink className={navItemClassName} to="/fraud-reporting">Reporting</NavLink>
          <NavLink className={navItemClassName} to="/recovery-center">Recovery</NavLink>
          <NavLink className={navItemClassName} to="/legal-compliance">Legal</NavLink>
          <NavLink className={navItemClassName} to="/about">About</NavLink>
          {user && <NavLink className={navItemClassName} to="/profile">Profile</NavLink>}
          {user?.role === "admin" && <NavLink className={navItemClassName} to="/admin">Admin</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/signup" className="btn-primary">Sign up</Link>
            </>
          ) : (
            <button onClick={logout} className="btn-secondary">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
}
