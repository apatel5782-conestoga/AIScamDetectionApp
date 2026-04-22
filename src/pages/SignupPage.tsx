import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import FraudWatchLogo from "../components/brand/FraudWatchLogo";
import { useAuth } from "../context/AuthContext";

const signupHighlights = [
  "Save your fraud analyses and case history",
  "Generate private reports for follow-up",
  "Track review status and evidence in one place",
  "Return to the same workspace whenever new details appear",
];

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsMatch = form.password.length > 0 && form.password === form.confirmPassword;
  const canSubmit = Boolean(form.name.trim() && form.email.trim() && form.phone.trim() && passwordsMatch);

  const getPasswordStrength = (password: string): { label: string; color: string; width: string } => {
    if (password.length === 0) return { label: "", color: "bg-gray-200", width: "0%" };
    if (password.length < 8) return { label: "Too short", color: "bg-red-400", width: "25%" };
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/.test(password)) return { label: "Strong", color: "bg-emerald-500", width: "100%" };
    if (/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) return { label: "Good", color: "bg-teal-500", width: "65%" };
    return { label: "Weak", color: "bg-amber-400", width: "40%" };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setIsSubmitting(true);

    register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      .then(() => navigate("/analyze"))
      .catch((err: Error) => setError(err.message || "Signup failed. Please try again."))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between bg-[linear-gradient(160deg,#0F172A_0%,#111827_55%,#115E59_100%)] p-12 text-white">
        <div className="inline-flex w-fit rounded-2xl bg-white/96 px-4 py-3 shadow-[0_16px_48px_rgba(15,23,42,0.22)]">
          <FraudWatchLogo widthClassName="w-[270px]" />
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Build your secure
            <br />
            fraud defense
            <br />
            workspace.
          </h1>
          <p className="mt-4 max-w-lg text-base text-teal-50/90">
            Create an account to keep your analysis history, organize evidence, and move from suspicion to safer action.
          </p>

          <div className="mt-10 space-y-4">
            {signupHighlights.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-400" />
                <span className="text-slate-100">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-teal-50/70">Private by design, with simple navigation and a professional white-background identity.</p>
      </div>

      <div className="flex flex-1 flex-col justify-center overflow-y-auto bg-white px-8 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <FraudWatchLogo widthClassName="w-[190px]" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-1 text-sm text-slate-500">Free access to your FraudWatch analysis workspace.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={form.name}
                onChange={(e) => setForm((previous) => ({ ...previous, name: e.target.value }))}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                type="email"
                value={form.email}
                onChange={(e) => setForm((previous) => ({ ...previous, email: e.target.value }))}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Phone Number</label>
              <input
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={form.phone}
                onChange={(e) => setForm((previous) => ({ ...previous, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
                autoComplete="tel"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-1">
                <input
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((previous) => ({ ...previous, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>

              {form.password.length > 0 ? (
                <div className="mt-1.5">
                  <div className="h-1.5 w-full rounded-full bg-slate-200">
                    <div className={`h-1.5 rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{strength.label}</p>
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                className={`mt-1 block w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-1 ${
                  form.confirmPassword.length > 0 && !passwordsMatch
                    ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                    : "border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                }`}
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((previous) => ({ ...previous, confirmPassword: e.target.value }))}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
              />
              {form.confirmPassword.length > 0 && !passwordsMatch ? (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-teal-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
