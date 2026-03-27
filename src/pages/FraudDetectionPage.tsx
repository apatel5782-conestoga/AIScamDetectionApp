import { useMemo, useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import FraudAnalysisCard from "../components/FraudAnalysisCard";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import LegalDisclaimer from "../components/LegalDisclaimer";
import RiskBreakdown from "../components/RiskBreakdown";
import SecurityRecommendations from "../components/SecurityRecommendations";
import { useAuth } from "../context/AuthContext";
import { fraudAnalysisService } from "../services/FraudAnalysisService";
import type { FraudAnalysis, FraudChannel } from "../types/fraud";

type EvidenceFile = {
  id: string;
  file: File;
};

const ACCEPTED_TYPES =
  "application/pdf,image/*,.eml,.msg,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.zip,.rar,.7z,.json";

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 25;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export default function FraudDetectionPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [channel, setChannel] = useState<FraudChannel>("Email");
  const [messageText, setMessageText] = useState("");
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [analysis, setAnalysis] = useState<FraudAnalysis | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const totalSize = useMemo(() => files.reduce((sum, item) => sum + item.file.size, 0), [files]);

  const addFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    const next: EvidenceFile[] = [];
    let nextError: string | null = null;

    if (files.length + list.length > MAX_FILES) {
      nextError = `You can upload up to ${MAX_FILES} files at once.`;
    }

    for (const file of list) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        nextError = `Each file must be under ${MAX_FILE_SIZE_MB} MB.`;
        continue;
      }
      next.push({ id: crypto.randomUUID(), file });
    }

    setFiles((prev) => [...prev, ...next].slice(0, MAX_FILES));
    setError(nextError);
  };

  const handleBrowse = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAnalyze = async () => {
    if (!consent) {
      setError("Confirm consent before submitting material for triage.");
      return;
    }

    if (!messageText.trim()) {
      setError("Paste the suspicious message or email content before running triage.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await fraudAnalysisService.createAnalysis({
        message: messageText,
        channel,
        evidenceSummary,
        evidenceFiles: files.map((item) => ({
          name: item.file.name,
          size: item.file.size,
          type: item.file.type || "application/octet-stream",
        })),
        authToken: token,
      });
      setAnalysis(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to run analysis right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analyze suspicious messages"
        subtitle="Run an AI-assisted triage check, review the reasoning, and turn the result into a private report."
      />

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Evidence Intake</p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">Prepare a guided triage submission</h2>
            <p className="mt-2 text-sm text-gray-600">
              Paste the suspicious message, describe any attachments, and include supporting file metadata.
            </p>
          </div>
          <button type="button" className="btn-secondary" onClick={() => inputRef.current?.click()}>
            Browse files
          </button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple
            accept={ACCEPTED_TYPES}
            onChange={handleBrowse}
          />
        </div>

        <div
          className="mt-5 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 text-center transition hover:border-blue-400"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <p className="text-sm text-gray-600">Drop files here</p>
          <p className="mt-2 text-xs text-gray-400">
            Supported: PDFs, images, email files (.eml/.msg), docs, sheets, archives, and more.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Max {MAX_FILES} files, {MAX_FILE_SIZE_MB} MB each.
          </p>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {files.length > 0 && (
          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{files.length} files selected</span>
              <span>Total size: {formatBytes(totalSize)}</span>
            </div>
            <div className="grid gap-2">
              {files.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.file.name}</p>
                    <p className="text-xs text-gray-500">{formatBytes(item.file.size)}</p>
                  </div>
                  <button type="button" className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => handleRemove(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Message Channel</label>
            <select
              className="form-input mt-2"
              value={channel}
              onChange={(event) => setChannel(event.target.value as FraudChannel)}
            >
              <option>Email</option>
              <option>SMS</option>
              <option>Phone</option>
              <option>Social Media</option>
              <option>Website</option>
              <option>Other</option>
            </select>

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-gray-500">Paste Suspicious Content</label>
            <textarea
              className="form-input mt-2 min-h-[160px]"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Paste the suspicious email, SMS, call summary, or chat transcript here."
            />

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-gray-500">Evidence Notes</label>
            <textarea
              className="form-input mt-2 min-h-[110px]"
              value={evidenceSummary}
              onChange={(event) => setEvidenceSummary(event.target.value)}
              placeholder="Optional: summarize screenshots, attachments, timeline details, or other evidence context."
            />
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="text-xs uppercase tracking-wide text-gray-400">How this helps</p>
            <ul className="mt-3 space-y-2">
              <li>Highlights suspicious language and impersonation patterns.</li>
              <li>Produces recommended next steps you can act on immediately.</li>
              <li>Lets you carry the result into a private case report with less re-entry.</li>
            </ul>
            {!user && (
              <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
                You can analyze as a guest. Sign in before reporting if you want the case saved to your account.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            I have consent to upload these materials for analysis.
          </label>
          <button className="btn-primary" type="button" disabled={!consent || isSubmitting} onClick={handleAnalyze}>
            {isSubmitting ? "Running triage..." : "Run triage analysis"}
          </button>
        </div>
      </Card>

      {analysis && (
        <>
          <FraudAnalysisCard
            analysis={analysis}
            onCreateReport={() => navigate("/reports")}
            reportActionLabel="Use this result in a private report"
          />
          <RiskBreakdown analysis={analysis} />
          <SecurityRecommendations analysis={analysis} />
        </>
      )}

      <Card className="p-6">
        <LegalDisclaimer />
      </Card>
    </div>
  );
}
