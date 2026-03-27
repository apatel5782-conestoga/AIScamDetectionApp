const features = [
  {
    title: "Severity-Driven Escalation",
    desc: "Automated low-to-critical classification with legal reporting workflow for critical fraud attempts.",
  },
  {
    title: "Regional Fraud Intelligence",
    desc: "Location-aware fraud trend insights mapped to Canadian regional threat patterns.",
  },
  {
    title: "Recovery & Protection Modules",
    desc: "Operational recommendations, immediate response steps, and identity protection procedures.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="glass-panel p-5">
              <h3 className="font-display text-xl text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">{feature.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
