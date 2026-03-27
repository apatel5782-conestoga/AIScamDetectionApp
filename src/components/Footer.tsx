export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/70">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-7 text-xs text-neutral-400 sm:flex-row sm:items-center">
        <p>Copyright {new Date().getFullYear()} AI Fraud Intelligence & Protection System</p>
        <p>Academic demonstration only. Legal-safe private reporting workflow.</p>
      </div>
    </footer>
  );
}
