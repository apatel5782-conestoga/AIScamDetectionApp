import type { Request, Response } from "express";

export function healthController(_req: Request, res: Response) {
  res.json({
    service: "AI Fraud Intelligence & Protection System API",
    status: "ok",
    disclaimer: "Academic demonstration only",
  });
}
