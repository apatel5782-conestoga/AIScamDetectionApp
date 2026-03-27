import { useMemo, useState } from "react";
import CommunityFeedCard from "../components/community/CommunityFeedCard";
import CommunityFilterBar from "../components/community/CommunityFilterBar";
import CommunitySubmissionForm, {
  fraudTypeOptions,
  regionOptions,
} from "../components/community/CommunitySubmissionForm";
import type { CommunityExperience, CommunityFormData } from "../components/community/types";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

const starterExperiences: CommunityExperience[] = [
  {
    id: "cx-1001",
    fraudType: "Bank Impersonation",
    lossRange: "$500 - $2,000",
    region: "Ontario",
    emotionalImpact: ["Anxiety", "Distrust"],
    description:
      "I received multiple urgent calls claiming to be from my bank's security team. The pressure to act quickly was overwhelming, but I stopped and called the official bank number directly.",
    postedDate: "February 14, 2026",
    moderationStatus: "approved",
  },
  {
    id: "cx-1002",
    fraudType: "Employment Fraud",
    lossRange: "Under $500",
    region: "British Columbia",
    emotionalImpact: ["Financial Stress", "Overwhelm"],
    description:
      "A fake recruiter requested upfront onboarding fees. I later learned it was fraudulent and shared this to help others verify employers through official websites before any payment.",
    postedDate: "February 11, 2026",
    moderationStatus: "approved",
  },
];

const initialForm: CommunityFormData = {
  fraudType: "",
  lossRange: "",
  region: "",
  emotionalImpact: [],
  description: "",
  disclaimerAccepted: false,
};

function containsPersonalIdentifiers(text: string): boolean {
  const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phonePattern = /\b(?:\+?\d{1,2}[\s-]?)?(?:\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4})\b/;
  return emailPattern.test(text) || phonePattern.test(text);
}

export default function CommunityFraudExperienceHubPage() {
  const [form, setForm] = useState<CommunityFormData>(initialForm);
  const [experiences, setExperiences] = useState<CommunityExperience[]>(starterExperiences);
  const [selectedFraudType, setSelectedFraudType] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const filteredExperiences = useMemo(
    () =>
      experiences.filter((item) => {
        const matchesType = selectedFraudType === "All" || item.fraudType === selectedFraudType;
        const matchesRegion = selectedRegion === "All" || item.region === selectedRegion;
        return item.moderationStatus === "approved" && matchesType && matchesRegion;
      }),
    [experiences, selectedFraudType, selectedRegion],
  );

  const submitExperience = () => {
    setValidationError(null);
    if (!form.fraudType || !form.lossRange || !form.region || !form.description.trim()) {
      setValidationError("Please complete all required fields.");
      return;
    }
    if (!form.disclaimerAccepted) {
      setValidationError("Please confirm the anonymity disclaimer before submission.");
      return;
    }
    if (containsPersonalIdentifiers(form.description)) {
      setValidationError("Submission blocked: remove names, phone numbers, and email addresses.");
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setExperiences((previous) => [
        {
          id: crypto.randomUUID(),
          fraudType: form.fraudType,
          lossRange: form.lossRange,
          region: form.region,
          emotionalImpact: form.emotionalImpact,
          description: form.description.trim(),
          postedDate: new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" }),
          moderationStatus: "pending",
        },
        ...previous,
      ]);
      setPendingCount((count) => count + 1);
      setForm(initialForm);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community Fraud Experience Hub"
        subtitle="Anonymous stories shared for awareness and recovery."
      />

      <Card className="p-4 text-sm text-gray-600">
        Content moderation is required. Anonymous only, no personal identifying information.
        {pendingCount > 0 && <span className="ml-1 font-medium text-gray-900">{pendingCount} submissions pending approval.</span>}
      </Card>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <CommunitySubmissionForm
            form={form}
            onChange={setForm}
            onSubmit={submitExperience}
            isSubmitting={isSubmitting}
            validationError={validationError}
          />
        </div>

        <div className="space-y-4 lg:col-span-3">
          <CommunityFilterBar
            fraudType={selectedFraudType}
            region={selectedRegion}
            fraudTypes={fraudTypeOptions}
            regions={regionOptions}
            onFraudTypeChange={setSelectedFraudType}
            onRegionChange={setSelectedRegion}
          />

          <div className="space-y-4">
            {filteredExperiences.length === 0 && (
              <Card className="p-6 text-sm text-gray-600">No approved experiences match these filters.</Card>
            )}
            {filteredExperiences.map((item) => (
              <CommunityFeedCard key={item.id} experience={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
