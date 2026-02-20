import { Link } from "react-router-dom";
import type { FormEvent } from "react";

export default function SignupPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="flex-1 px-4 py-10 md:py-14">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">
        <section className="panel overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80"
            alt="Professional analyst using cybersecurity dashboard"
            className="h-56 w-full object-cover"
          />
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f4c81]">Join The Network</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-3 text-slate-600">
              Sign up to report scam attempts, contribute to the community feed, and monitor threat patterns.
            </p>
          </div>
        </section>

        <section className="panel p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Set up your profile</h2>
          <p className="text-sm text-slate-600 mt-1">It only takes a minute.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm text-slate-700">Full Name</span>
              <input
                type="text"
                required
                placeholder="Your name"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Email</span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Password</span>
              <input
                type="password"
                required
                placeholder="Create a password"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
              />
            </label>

            <button type="submit" className="btn-primary w-full">
              Sign Up
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Already have an account? <Link to="/login" className="text-[#0f4c81] font-semibold">Log in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
