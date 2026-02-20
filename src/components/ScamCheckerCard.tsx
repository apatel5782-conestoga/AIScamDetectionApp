import { useMemo, useState } from "react";

type Result = {
  label: "Scam" | "Likely Safe" | null;
  confidence: number | null;
  reasons: string[];
};

export default function ScamCheckerCard() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Result>({
    label: null,
    confidence: null,
    reasons: [],
  });

  const wordCount = useMemo(
    () => message.trim().split(/\s+/).filter(Boolean).length,
    [message],
  );

  const analyze = () => {
    const text = message.toLowerCase();

    const rules: { key: string; reason: string; weight: number }[] = [
      { key: "urgent", reason: "Uses urgency or pressure language.", weight: 18 },
      { key: "immediately", reason: "Asks you to act immediately.", weight: 12 },
      { key: "verify", reason: "Requests account verification details.", weight: 14 },
      { key: "password", reason: "Mentions passwords, common in phishing.", weight: 18 },
      { key: "otp", reason: "Mentions OTP or code requests.", weight: 18 },
      { key: "bank", reason: "Mentions bank or financial institution.", weight: 10 },
      { key: "click", reason: "Asks you to click a link.", weight: 14 },
      { key: "link", reason: "Contains link-related language.", weight: 10 },
      { key: "won", reason: "Mentions prizes or winnings.", weight: 12 },
      { key: "gift card", reason: "Mentions gift cards, often used in scams.", weight: 16 },
    ];

    const reasons: string[] = [];
    let score = 0;

    for (const rule of rules) {
      if (text.includes(rule.key)) {
        reasons.push(rule.reason);
        score += rule.weight;
      }
    }

    const hasUrl = /(https?:\/\/|www\.)\S+/i.test(message);
    if (hasUrl) {
      reasons.push("Contains a URL. Links are common in phishing attempts.");
      score += 18;
    }

    score = Math.min(100, score);

    if (!message.trim()) {
      setResult({ label: null, confidence: null, reasons: [] });
      return;
    }

    const label: Result["label"] = score >= 55 ? "Scam" : "Likely Safe";
    setResult({
      label,
      confidence: score,
      reasons: reasons.length ? reasons : ["No obvious scam patterns detected by these rules."],
    });
  };

  const badge =
    result.label === "Scam"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : result.label === "Likely Safe"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <section className="panel p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#0f4c81]">AI Message Scanner</p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-2">Analyze a suspicious message</h2>
          <p className="mt-1 text-sm text-slate-600">
            Paste the message you received and review its risk indicators.
          </p>
        </div>

        <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${badge}`}>
          {result.label
            ? `${result.label}${result.confidence !== null ? ` | ${result.confidence}%` : ""}`
            : "No result"}
        </div>
      </div>

      <div className="mt-5">
        <textarea
          className="w-full border border-slate-200 rounded-xl p-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
          placeholder="Example: Your bank account is locked. Verify now at http://..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{wordCount} words</span>
          <button
            onClick={() => {
              setMessage("");
              setResult({ label: null, confidence: null, reasons: [] });
            }}
            className="hover:text-slate-700"
            type="button"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button onClick={analyze} className="btn-primary w-full sm:w-auto" type="button">
          Analyze Message
        </button>

        <button
          onClick={() =>
            setMessage(
              "URGENT: Your bank account will be suspended. Verify your OTP immediately by clicking this link: http://secure-bank-login.example",
            )
          }
          className="btn-secondary w-full sm:w-auto"
          type="button"
        >
          Try Sample Scam
        </button>
      </div>

      {result.label && (
        <div className="mt-6 border border-slate-200 rounded-2xl p-4 bg-slate-50">
          <h3 className="font-semibold text-slate-900">Why this result</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
            {result.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            This is a rule-based MVP checker. Next step is integrating a trained ML model.
          </p>
        </div>
      )}
    </section>
  );
}
