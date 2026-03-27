import type { DashboardData } from "../types/dashboard";

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => resolve(), ms);

    if (!signal) return;

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export async function fetchDashboardData(signal?: AbortSignal): Promise<DashboardData> {
  await delay(450, signal);

  return {
    heroTitle: "AI Fraud Intelligence & Protection System",
    heroSubtitle: "Protecting communities through awareness, detection, and recovery.",
    kpis: [
      { label: "Total Analyses", value: 24892, trendText: "+12% this week", tone: "brand", icon: "shield" },
      { label: "High Risk Cases", value: 612, trendText: "+7% this week", tone: "critical", icon: "alert" },
      { label: "Community Reports", value: 1438, trendText: "+9% this week", tone: "brand", icon: "users" },
      { label: "Avg Confidence", value: 89, trendText: "+2% this week", tone: "positive", icon: "confidence" },
      { label: "Resolved Alerts", value: 472, trendText: "+15% this week", tone: "positive", icon: "pulse" },
      { label: "Open Investigations", value: 73, trendText: "-4% this week", tone: "critical", icon: "risk" },
    ],
    trend: [
      { month: "Jan", value: 78 },
      { month: "Feb", value: 92 },
      { month: "Mar", value: 88 },
      { month: "Apr", value: 104 },
      { month: "May", value: 96 },
      { month: "Jun", value: 109 },
      { month: "Jul", value: 101 },
    ],
    alerts: [
      {
        id: "ALT-2401",
        message: "Critical credential phishing attempt targeting payroll inboxes.",
        severity: "Critical",
        date: "Feb 26, 2026",
      },
      {
        id: "ALT-2398",
        message: "Bank impersonation phone campaign detected in Ontario cluster.",
        severity: "High",
        date: "Feb 25, 2026",
      },
      {
        id: "ALT-2392",
        message: "Invoice link spoofing pattern reported across SMB accounts.",
        severity: "Medium",
        date: "Feb 24, 2026",
      },
      {
        id: "ALT-2389",
        message: "Suspicious onboarding fee scam surfaced in community reports.",
        severity: "Medium",
        date: "Feb 23, 2026",
      },
    ],
  };
}
