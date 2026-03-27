export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,59,48,0.18),transparent_42%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-neutral-400">Fraud Intelligence Command</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl">
            AI Fraud Intelligence & Protection System
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-300 md:text-base">
            Analyze suspicious communications, classify fraud severity, trigger escalation workflows, and deploy guided security responses from one operational dashboard.
          </p>
        </div>

        <div className="glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">Live Summary</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-neutral-400">Messages Analyzed</p>
              <p className="mt-2 font-display text-3xl text-white">21,640</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-neutral-400">Escalations</p>
              <p className="mt-2 font-display text-3xl text-white">1,182</p>
            </div>
            <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-neutral-400">Dominant Pattern</p>
              <p className="mt-2 text-base text-white">Bank impersonation with OTP extraction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
