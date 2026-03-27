import { useMemo } from "react";
import Card from "../ui/Card";
import type { CommunityFormData, EmotionalImpactTag } from "./types";

const emotionalTags: EmotionalImpactTag[] = [
  "Anxiety",
  "Shame",
  "Financial Stress",
  "Distrust",
  "Relief",
  "Overwhelm",
];

const fraudTypeOptions = [
  "Phishing",
  "Bank Impersonation",
  "Investment Fraud",
  "Employment Fraud",
  "Romance Fraud",
  "Identity Theft",
];

const lossRanges = ["No Loss", "Under $500", "$500 - $2,000", "$2,000 - $10,000", "Above $10,000"];
const regionOptions = ["Ontario", "Quebec", "British Columbia", "Alberta", "Nova Scotia"];

export { fraudTypeOptions, lossRanges, regionOptions };

export default function CommunitySubmissionForm({
  form,
  onChange,
  onSubmit,
  isSubmitting,
  validationError,
}: {
  form: CommunityFormData;
  onChange: (next: CommunityFormData) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  validationError: string | null;
}) {
  const charactersUsed = useMemo(() => form.description.length, [form.description.length]);

  const toggleImpactTag = (tag: EmotionalImpactTag) => {
    const exists = form.emotionalImpact.includes(tag);

    onChange({
      ...form,
      emotionalImpact: exists
        ? form.emotionalImpact.filter((item) => item !== tag)
        : [...form.emotionalImpact, tag],
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900">Share Your Experience</h2>
      <p className="mt-1 text-sm text-gray-600">Anonymous submission for awareness and recovery guidance.</p>

      <div className="mt-5 space-y-4">
        <label className="block text-sm text-gray-700">
          <span className="mb-1 block font-medium text-gray-900">Fraud Type</span>
          <select
            value={form.fraudType}
            onChange={(event) => onChange({ ...form, fraudType: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
          >
            <option value="">Select a fraud type</option>
            {fraudTypeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-gray-700">
          <span className="mb-1 block font-medium text-gray-900">Loss Range</span>
          <select
            value={form.lossRange}
            onChange={(event) => onChange({ ...form, lossRange: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
          >
            <option value="">Select loss range</option>
            {lossRanges.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-gray-700">
          <span className="mb-1 block font-medium text-gray-900">Region</span>
          <select
            value={form.region}
            onChange={(event) => onChange({ ...form, region: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
          >
            <option value="">Select a region</option>
            {regionOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-900">Emotional Impact</p>
          <div className="flex flex-wrap gap-2">
            {emotionalTags.map((tag) => {
              const isActive = form.emotionalImpact.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleImpactTag(tag)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    isActive
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-500"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block text-sm text-gray-700">
          <span className="mb-1 block font-medium text-gray-900">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => onChange({ ...form, description: event.target.value.slice(0, 500) })}
            maxLength={500}
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
            placeholder="Describe the experience without personal names, contact details, or identifying information."
          />
          <p className="mt-1 text-xs text-gray-500">{charactersUsed}/500 characters</p>
        </label>

        <label className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
          <input
            type="checkbox"
            checked={form.disclaimerAccepted}
            onChange={(event) => onChange({ ...form, disclaimerAccepted: event.target.checked })}
            className="mt-0.5"
          />
          <span>
            I confirm this experience is shared anonymously and contains no personal identifying information.
          </span>
        </label>

        {validationError && <p className="text-sm text-red-600">{validationError}</p>}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Experience"}
        </button>
      </div>
    </Card>
  );
}
