import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import FraudWatchLogo from "../components/brand/FraudWatchLogo";
import { useAuth } from "../context/AuthContext";

const adminHighlights = [
  { label: "Review Queue", desc: "Manage submitted fraud reports and triage decisions." },
  { label: "Analytics", desc: "Track patterns, operational load, and review outcomes." },
  { label: "Case Status", desc: "Advance reports through audit and escalation workflows." },
  { label: "System Logs", desc: "Monitor platform activity across detection operations." },
];

export default function AdminLoginPage() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setError(null);
    setIsSubmitting(true);

    login(email, password)
      .then(() => navigate("/admin"))
      .catch((err: Error) => setError(err.message || "Login failed. Check your credentials."))
      .finally(() => setIsSubmitting(false));
  };

  const handleDemoAdmin = () => {
    setError(null);
    setIsSubmitting(true);

    loginAsDemo("admin")
      .then(() => navigate("/admin"))
      .catch((err: Error) => setError(err.message || "Demo admin login failed."))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#020617_0%,#0F172A_60%,#134E4A_100%)] p-12 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-16 top-20 h-64 w-64 rounded-full bg-teal-400 blur-3xl" />
          <div className="absolute bottom-16 right-16 h-56 w-56 rounded-full bg-slate-500 blur-3xl" />
        </div>

        <div className="relative inline-flex w-fit rounded-2xl bg-white/96 px-4 py-3 shadow-[0_16px_48px_rgba(15,23,42,0.24)]">
          <FraudWatchLogo widthClassName="w-[270px]" />
        </div>

        <div className="relative">
          <span className="inline-block rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-teal-200">
            ADMIN ACCESS
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
            Secure admin
            <br />
            oversight for
            <br />
            FraudWatch.
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">
            Access the fraud review queue, manage case status changes, and monitor platform operations through a focused control panel.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {adminHighlights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-slate-400">Restricted access for trusted administrators only.</p>
      </div>

      <div className="flex flex-1 flex-col justify-center bg-slate-950 px-8 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 inline-flex rounded-2xl bg-white px-3 py-2 lg:hidden">
            <FraudWatchLogo widthClassName="w-[190px]" />
          </div>

          <div className="mb-6 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-300">This login is restricted to administrators only.</p>
          </div>

          <h2 className="text-2xl font-bold text-white">Admin Sign In</h2>
          <p className="mt-1 text-sm text-slate-400">Enter your admin credentials to access the FraudWatch control panel.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300">Admin Email</label>
              <input
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative mt-1">
                <input
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-700/50 bg-red-900/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!email.trim() || !password.trim() || isSubmitting}
              className="w-full rounded-xl bg-teal-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-400 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in to Admin Panel"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center bg-slate-950 px-2 text-xs text-slate-500">or use demo admin account</div>
            </div>

            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={isSubmitting}
              className="mt-4 w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              Login as Demo Admin
            </button>
          </div>

          <div className="mt-8 space-y-2 text-center text-sm">
            <p className="text-slate-500">
              Not an admin?{" "}
              <Link to="/login" className="font-medium text-teal-300 hover:underline">
                Regular user login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
