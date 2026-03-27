import type { FraudSeverity } from "../types/fraud";

export function getSeverityByScore(riskScore: number): FraudSeverity {
  if (riskScore >= 86) return "Critical Risk";
  if (riskScore >= 71) return "High Risk";
  if (riskScore >= 41) return "Medium Risk";
  return "Low Risk";
}

export function getSeverityClasses(severity: FraudSeverity): string {
  switch (severity) {
    case "Critical Risk":
      return "bg-risk-critical/15 text-risk-critical border-risk-critical/70";
    case "High Risk":
      return "bg-risk-high/15 text-risk-high border-risk-high/70";
    case "Medium Risk":
      return "bg-risk-medium/15 text-risk-medium border-risk-medium/70";
    default:
      return "bg-risk-low/15 text-risk-low border-risk-low/70";
  }
}
