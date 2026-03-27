export interface RegionalFraudInsight {
  regionCode: string;
  regionName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  riskHeat: number;
  trendChangePercent: number;
  recentFraudTypes: string[];
  incidentsLast30Days: number;
  impactedGroups: string[];
}

export const canadaRegionalFraudData: RegionalFraudInsight[] = [
  {
    regionCode: "ON",
    regionName: "Ontario",
    coordinates: { lat: 43.65107, lng: -79.347015 },
    riskHeat: 78,
    trendChangePercent: 14,
    recentFraudTypes: ["Bank Impersonation", "Crypto Investment Fraud", "Employment Fraud"],
    incidentsLast30Days: 318,
    impactedGroups: ["Seniors", "New immigrants", "Small businesses"],
  },
  {
    regionCode: "BC",
    regionName: "British Columbia",
    coordinates: { lat: 49.282729, lng: -123.120738 },
    riskHeat: 64,
    trendChangePercent: 9,
    recentFraudTypes: ["Delivery SMS Fraud", "Rental Deposit Fraud", "Tech Support Fraud"],
    incidentsLast30Days: 201,
    impactedGroups: ["Renters", "Students", "Remote workers"],
  },
  {
    regionCode: "AB",
    regionName: "Alberta",
    coordinates: { lat: 53.546124, lng: -113.493823 },
    riskHeat: 59,
    trendChangePercent: 6,
    recentFraudTypes: ["Invoice Fraud", "Energy Utility Impersonation", "Tax Refund Fraud"],
    incidentsLast30Days: 174,
    impactedGroups: ["Contractors", "Payroll teams", "Rural residents"],
  },
  {
    regionCode: "QC",
    regionName: "Quebec",
    coordinates: { lat: 45.501689, lng: -73.567256 },
    riskHeat: 71,
    trendChangePercent: 12,
    recentFraudTypes: ["Marketplace Fraud", "Identity Theft", "Romance Fraud"],
    incidentsLast30Days: 289,
    impactedGroups: ["Online sellers", "Gig workers", "Retirees"],
  },
  {
    regionCode: "NS",
    regionName: "Nova Scotia",
    coordinates: { lat: 44.648764, lng: -63.575239 },
    riskHeat: 48,
    trendChangePercent: 3,
    recentFraudTypes: ["Government Benefit Fraud", "Charity Fraud", "Card Skimming"],
    incidentsLast30Days: 88,
    impactedGroups: ["Students", "Non-profits", "Tourists"],
  },
];
