import multer from "multer";
import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Uploaded file is too large. Maximum size is 25 MB per file." });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many uploaded files. Maximum is 5 files per message." });
    }

    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({ message: "Server error", details: error.message });
}
