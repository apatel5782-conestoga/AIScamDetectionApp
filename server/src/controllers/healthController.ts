import type { Request, Response } from "express";

export function healthController(_req: Request, res: Response) {
  res.json({
    service: "AI-Assisted Fraud Triage and Reporting API",
    status: "ok",
    disclaimer: "Academic demonstration only",
  });
}
