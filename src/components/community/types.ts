export type EmotionalImpactTag =
  | "Anxiety"
  | "Shame"
  | "Financial Stress"
  | "Distrust"
  | "Relief"
  | "Overwhelm";

export type CommunityExperience = {
  id: string;
  fraudType: string;
  lossRange: string;
  region: string;
  emotionalImpact: EmotionalImpactTag[];
  description: string;
  postedDate: string;
  moderationStatus: "approved" | "pending";
};

export type CommunityFormData = {
  fraudType: string;
  lossRange: string;
  region: string;
  emotionalImpact: EmotionalImpactTag[];
  description: string;
  disclaimerAccepted: boolean;
};
