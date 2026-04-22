import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FraudWatchLogo from "../components/brand/FraudWatchLogo";
import { useAuth } from "../context/AuthContext";

const loginHighlights = [
  "AI-assisted message and attachment review",
  "Private fraud case tracking and reporting",
  "Built-in recovery guidance and next steps",
  "Fast triage support across screenshots, PDFs, and emails",
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = (location.state as { from?: string } | undefined)?.from || "/analyze";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;

    setError(null);
    setIsSubmitting(true);

    login(identifier, password)
      .then(() => {
        const stored = localStorage.getItem("auth_user");
        const user = stored ? (JSON.parse(stored) as { role?: string }) : null;
        navigate(user?.role === "admin" ? "/admin" : redirectPath);
      })
      .catch((err: Error) => setError(err.message || "Invalid credentials. Please try again."))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[linear-gradient(160deg,#0F172A_0%,#111827_55%,#134E4A_100%)] p-12 text-white">
        <div className="inline-flex w-fit rounded-2xl bg-white/96 px-4 py-3 shadow-[0_16px_48px_rgba(15,23,42,0.22)]">
          <FraudWatchLogo widthClassName="w-[270px]" />
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Detect scams.
            <br />
            Review risk.
            <br />
            Act with confidence.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-teal-50/90">
            FraudWatch gives users a clean, intelligent workspace for analyzing suspicious content and following safer next steps.
          </p>

          <div className="mt-10 space-y-4">
            {loginHighlights.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-400" />
                <span className="text-slate-100">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-teal-50/70">Academic demonstration platform, designed for awareness and decision support.</p>
      </div>

      <div className="flex flex-1 flex-col justify-center bg-white px-8 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <FraudWatchLogo widthClassName="w-[190px]" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue to your fraud detection workspace.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email or Username</label>
              <input
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-teal-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="relative mt-1">
                <input
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!identifier.trim() || !password.trim() || isSubmitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-teal-700 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
