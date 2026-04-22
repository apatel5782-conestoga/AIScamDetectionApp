import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.2),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(239,68,68,0.2),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20">
          <p className="text-xs uppercase tracking-[0.24em] text-blue-300">Enterprise Fraud Defense Platform</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white md:text-6xl">
            FraudWatch
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-neutral-300 md:text-base">
            Full-stack fraud intelligence platform with detection engine, severity escalation, reporting workflows, location risk analytics, and compliance-safe recovery guidance.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/fraud-detection" className="btn-primary">Launch Detection Engine</Link>
            <Link to="/fraud-map" className="btn-secondary">Open Location Risk Intelligence</Link>
          </div>
          <p className="mt-5 max-w-3xl text-xs text-neutral-400">
            Academic demonstration only. No public accusation or defamation workflows are provided.
          </p>
        </div>
      </section>
    </main>
  );
}
