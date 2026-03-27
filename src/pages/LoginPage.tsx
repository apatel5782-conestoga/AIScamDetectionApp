import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const [captchaSeed, setCaptchaSeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = (location.state as { from?: string } | undefined)?.from || "/";
  const captchaCode = useMemo(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i += 1) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }, [captchaSeed]);

  const isCaptchaValid = captchaInput.trim().toUpperCase() === captchaCode;
  const canSubmit =
    username.trim().length > 0 &&
    password.trim().length > 0 &&
    isHuman &&
    isCaptchaValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    setError(null);
    setIsSubmitting(true);
    login(username, password)
      .then(() => navigate(redirectPath))
      .catch((err: Error) => {
        setError(err.message || "Login failed. Please try again.");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-xl space-y-6">
        <PageHeader title="Sign In" subtitle="Secure access to the AI Fraud Intelligence & Protection System." />
        <Card className="p-6">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Username</label>
              <input
                className="form-input mt-2"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username or email"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
              <input
                className="form-input mt-2"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Captcha code</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-gray-900">{captchaCode}</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setCaptchaInput("");
                    setCaptchaSeed((prev) => prev + 1);
                  }}
                >
                  Refresh
                </button>
              </div>
              <input
                className="form-input mt-3"
                value={captchaInput}
                onChange={(event) => setCaptchaInput(event.target.value)}
                placeholder="Type the code above"
                required
              />
              <label className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={isHuman} onChange={(event) => setIsHuman(event.target.checked)} />
                I am human
              </label>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary" type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
            <Link className="text-gray-900 underline" to="/forgot-password">Forgot password?</Link>
            <span>Need account access? <Link className="text-gray-900 underline" to="/signup">Sign up</Link></span>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Demo access</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button className="btn-primary" onClick={() => { loginAsDemo("user"); navigate(redirectPath); }}>
                Login as User
              </button>
              <button className="btn-secondary" onClick={() => { loginAsDemo("admin"); navigate("/admin"); }}>
                Login as Admin
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
