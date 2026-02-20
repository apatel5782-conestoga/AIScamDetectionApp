export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f4c81] to-[#08335a]" />
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 70% 20%, #f97316, transparent 36%)" }} />

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
        <div className="text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Fraud Intelligence Platform</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
            Spot scam patterns before they cost you money
          </h1>
          <p className="mt-4 max-w-2xl text-slate-100 text-base md:text-lg">
            Use AI-assisted analysis and community insights to detect phishing, impersonation, and social engineering attempts across email, SMS, and social apps.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5">Real-time warning signals</span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5">Explainable confidence score</span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5">Community-reported cases</span>
          </div>
        </div>

        <div className="panel overflow-hidden border-white/15 bg-white/10 backdrop-blur text-white">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80"
            alt="Professional cybersecurity monitoring setup"
            className="h-52 w-full object-cover"
          />
          <div className="p-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-slate-200">Cases Analyzed</p>
              <p className="mt-1 text-2xl font-bold">18,400+</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-slate-200">Threat Types</p>
              <p className="mt-1 text-2xl font-bold">42</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 col-span-2">
              <p className="text-slate-200">Most common trend</p>
              <p className="mt-1 text-base font-semibold">Account verification phishing messages</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
