const features = [
  {
    title: "Faster Risk Detection",
    desc: "Get quick scam probability scoring with plain-language reasons to support safer decisions.",
  },
  {
    title: "Community Signal Layer",
    desc: "Review reports from people who experienced similar scam patterns in your area.",
  },
  {
    title: "Education-First Workflow",
    desc: "Learn scam red flags and response actions to reduce future exposure.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f4c81]">Why This Platform</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">Designed for practical scam prevention</h2>
          </div>
          <p className="text-sm text-slate-600 max-w-xl">
            Built for students, families, and professionals who need trustworthy guidance and a cleaner way to report scam attempts.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((f, index) => (
            <div key={f.title} className="panel p-6 hover:-translate-y-0.5 transition-transform">
              <p className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f4c81]/10 text-[#0f4c81] font-bold text-sm">
                {index + 1}
              </p>
              <h3 className="mt-4 font-semibold text-lg text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
