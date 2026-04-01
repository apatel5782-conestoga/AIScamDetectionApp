import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-screen flex bg-gray-950">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-indigo-500 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">AIScamDetectionApp</span>
        </div>

        <div className="relative">
          <span className="inline-block rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-600/30">
            ADMIN ACCESS
          </span>
          <h1 className="mt-4 text-4xl font-bold text-white leading-tight">
            Secure Admin<br />Control Panel
          </h1>
          <p className="mt-4 text-gray-400">
            Access the fraud report review queue, manage case statuses, view analytics, and oversee all triage operations.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: "Review Queue", desc: "Manage all submitted reports" },
              { label: "Analytics", desc: "Track fraud trends and stats" },
              { label: "Case Status", desc: "Update and escalate cases" },
              { label: "System Logs", desc: "Monitor all platform activity" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-gray-500">Restricted access — administrators only.</p>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 bg-gray-950">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="font-bold text-white">Admin Panel</span>
          </div>

          <div className="mb-6 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-300">This login is restricted to administrators only.</p>
          </div>

          <h2 className="text-2xl font-bold text-white">Admin Sign In</h2>
          <p className="mt-1 text-sm text-gray-400">Enter your admin credentials to access the control panel</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300">Admin Email</label>
              <input
                className="mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative mt-1">
                <input
                  className="block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-900/30 border border-red-700/50 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!email.trim() || !password.trim() || isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Signing in..." : "Sign in to Admin Panel"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-500 bg-gray-950 px-2">
                or use demo admin account
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={isSubmitting}
              className="mt-4 w-full rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              Login as Demo Admin
            </button>
          </div>

          <div className="mt-8 space-y-2 text-center text-sm">
            <p className="text-gray-500">
              Not an admin?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Regular user login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
