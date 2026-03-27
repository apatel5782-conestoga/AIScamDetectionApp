import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsMatch = form.password.length > 0 && form.password === form.confirmPassword;
  const canSubmit = passwordsMatch;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setIsSubmitting(true);
    register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    })
      .then(() => setSubmitted(true))
      .catch((err: Error) => {
        setError(err.message || "Signup failed. Please try again.");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-xl space-y-6">
        <PageHeader title="Create Account" subtitle="Provision user access for the fraud intelligence workspace." />
        <Card className="p-6">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Name</label>
              <input
                className="form-input mt-2"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Full name"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
              <input
                className="form-input mt-2"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone number</label>
              <input
                className="form-input mt-2"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="(555) 123-4567"
                autoComplete="tel"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Create password</label>
                <input
                  className="form-input mt-2"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Confirm password</label>
                <input
                  className="form-input mt-2"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            {!passwordsMatch && form.confirmPassword.length > 0 && (
              <p className="text-sm text-red-600">Passwords do not match.</p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary" type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create account"}
            </button>
          </form>
          {submitted && (
            <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Account created. Please sign in to continue.
            </p>
          )}
          <p className="mt-4 text-sm text-gray-500">Already registered? <Link to="/login" className="text-gray-900 underline">Sign in</Link></p>
        </Card>
      </div>
    </div>
  );
}
