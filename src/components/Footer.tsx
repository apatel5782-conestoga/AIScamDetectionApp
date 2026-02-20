export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/90">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
        <p className="text-slate-600">Copyright {new Date().getFullYear()} AI Scam Detection Platform</p>
        <p className="text-slate-500">Protect. Report. Educate.</p>
      </div>
    </footer>
  );
}
