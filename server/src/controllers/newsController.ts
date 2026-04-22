import type { Request, Response } from "express";
import { getCyberFraudNews } from "../services/newsService";

export async function newsController(req: Request, res: Response) {
  const location = typeof req.query.location === "string" ? req.query.location.trim() : undefined;
  const city = typeof req.query.city === "string" ? req.query.city.trim() : undefined;
  const state = typeof req.query.state === "string" ? req.query.state.trim() : undefined;
  const country = typeof req.query.country === "string" ? req.query.country.trim() : undefined;

  try {
    const articles = await getCyberFraudNews({ location, city, state, country });
    return res.json({ articles });
  } catch (err) {
    console.error("News fetch error:", err);
    return res.status(500).json({ message: "Unable to fetch news at this time.", articles: [] });
  }
}
