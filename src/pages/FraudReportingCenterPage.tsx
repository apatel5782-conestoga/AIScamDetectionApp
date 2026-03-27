import { useState } from "react";
import LegalDisclaimer from "../components/LegalDisclaimer";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import type { FraudReport } from "../models/FraudReport";
import { generateFraudReportPdf, submitFraudReport } from "../services/fraudReportService";

const initialState: FraudReport = {
  title: "",
  description: "",
  evidenceDescription: "",
  fraudType: "",
  channel: "Email",
  amountLost: 0,
  severity: "Medium Risk",
  status: "pending",
  legalDisclaimerAccepted: false,
};

export default function FraudReportingCenterPage() {
  const [form, setForm] = useState<FraudReport>(initialState);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.legalDisclaimerAccepted) {
      setError("You must accept the legal disclaimer before submission.");
      return;
    }

    try {
      const response = await submitFraudReport(form);
      setSubmittedId(response.id);
    } catch {
      const offlineId = `offline-${Date.now()}`;
      setSubmittedId(offlineId);
      localStorage.setItem(`fraud-report-${offlineId}`, JSON.stringify(form));
    }
  };

  const handlePdfDownload = async () => {
    if (!submittedId) return;

    try {
      const blob = await generateFraudReportPdf(submittedId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fraud-report-${submittedId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      const data = new Blob([JSON.stringify(form, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fraud-report-${submittedId}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports Center"
        subtitle="Submit private fraud reports for admin-reviewed workflow and secure record generation."
      />

      <Card className="p-6">
        <LegalDisclaimer />
      </Card>

      <Card className="p-6">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <input className="form-input" placeholder="Report title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="form-input" placeholder="Fraud type" value={form.fraudType} onChange={(e) => setForm({ ...form, fraudType: e.target.value })} required />
          <select className="form-input" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as FraudReport["channel"] })}>
            <option>Email</option><option>SMS</option><option>Phone</option><option>Social Media</option><option>Website</option><option>Other</option>
          </select>
          <textarea className="form-input" rows={4} placeholder="Incident description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <textarea className="form-input" rows={4} placeholder="Evidence description" value={form.evidenceDescription} onChange={(e) => setForm({ ...form, evidenceDescription: e.target.value })} required />
          <input className="form-input" type="number" min={0} placeholder="Estimated amount lost" value={form.amountLost ?? 0} onChange={(e) => setForm({ ...form, amountLost: Number(e.target.value) })} />

          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.legalDisclaimerAccepted} onChange={(e) => setForm({ ...form, legalDisclaimerAccepted: e.target.checked })} />
            I confirm this report is factual to the best of my knowledge and shared under legal-safe private reporting policy.
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" type="submit">Submit Report</button>
            <button type="button" className="btn-secondary" onClick={handlePdfDownload} disabled={!submittedId}>Download PDF</button>
          </div>

          {submittedId && <p className="text-sm text-gray-600">Submitted report ID: {submittedId}</p>}
        </form>
      </Card>
    </div>
  );
}
