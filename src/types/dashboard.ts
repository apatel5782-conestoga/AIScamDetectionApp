export type DashboardKpi = {
  label: string;
  value: number;
  trendText: string;
  tone: "brand" | "positive" | "critical";
  icon: "shield" | "alert" | "users" | "confidence" | "pulse" | "risk";
};

export type DashboardAlert = {
  id: string;
  message: string;
  severity: "Critical" | "High" | "Medium";
  date: string;
};

export type DashboardTrendPoint = {
  month: string;
  value: number;
};

export type DashboardData = {
  heroTitle: string;
  heroSubtitle: string;
  kpis: DashboardKpi[];
  trend: DashboardTrendPoint[];
  alerts: DashboardAlert[];
};
