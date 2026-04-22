import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`app-card relative overflow-hidden ${className}`.trim()}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-24 w-24 rounded-full bg-teal-100/45 blur-2xl" />
        <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-sky-100/35 blur-2xl" />
        <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,184,166,0.45),transparent)]" />
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}
