import type { Request, Response } from "express";
import { chatWithAI, type ChatMessage } from "../services/chatbotService";

export async function chatbotController(req: Request, res: Response) {
  const { messages, location } = req.body as { messages: ChatMessage[]; location?: string };

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: "messages array is required." });
  }

  if (messages.length > 20) {
    return res.status(400).json({ message: "Too many messages. Max 20 in a conversation." });
  }

  for (const msg of messages) {
    if (!["user", "assistant"].includes(msg.role) || typeof msg.content !== "string") {
      return res.status(400).json({ message: "Invalid message format." });
    }
  }

  try {
    const reply = await chatWithAI(messages, typeof location === "string" ? location : undefined);
    return res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    return res.status(500).json({ message: "AI assistant is temporarily unavailable. Please try again." });
  }
}
