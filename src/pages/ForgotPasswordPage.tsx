import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setIsSubmitting(true);
    forgotPassword(email)
      .then((text) => {
        setMessage(text);
        setSubmitted(true);
      })
      .catch((err: Error) => {
        setError(err.message || "Request failed. Please try again.");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-xl space-y-6">
        <PageHeader title="Forgot Password" subtitle="Reset your account access securely." />
        <Card className="p-6">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
              <input
                className="form-input mt-2"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {submitted && (
            <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message || `If an account exists for ${email || "this email"}, you will receive password reset instructions.`}
            </p>
          )}
          <p className="mt-4 text-sm text-gray-500">
            Remembered your password? <Link to="/login" className="text-gray-900 underline">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
