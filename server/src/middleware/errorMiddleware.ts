import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  res.status(500).json({ message: "Server error", details: error.message });
}
