import type { Request, Response } from "express";
import { chatWithAI, type ChatMessage } from "../services/chatbotService";
import { extractTextFromFiles } from "../services/fileExtractionService";

function parseMessages(input: unknown): ChatMessage[] | null {
  if (Array.isArray(input)) {
    return input as ChatMessage[];
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input) as unknown;
      return Array.isArray(parsed) ? (parsed as ChatMessage[]) : null;
    } catch {
      return null;
    }
  }

  return null;
}

export async function chatbotController(req: Request, res: Response) {
  const messages = parseMessages(req.body?.messages);
  const location = typeof req.body?.location === "string" ? req.body.location : undefined;
  const uploadedFiles = (req.files as Express.Multer.File[]) || [];

  if ((!Array.isArray(messages) || messages.length === 0) && uploadedFiles.length === 0) {
    return res.status(400).json({ message: "Provide a message or upload at least one file." });
  }

  const normalizedMessages = Array.isArray(messages) ? messages : [];

  if (normalizedMessages.length > 20) {
    return res.status(400).json({ message: "Too many messages. Max 20 in a conversation." });
  }

  for (const msg of normalizedMessages) {
    if (!["user", "assistant"].includes(msg.role) || typeof msg.content !== "string") {
      return res.status(400).json({ message: "Invalid message format." });
    }
  }

  try {
    const uploadedContext = uploadedFiles.length > 0
      ? await extractTextFromFiles(
        uploadedFiles.map((file) => ({
          buffer: file.buffer,
          mimetype: file.mimetype,
          originalname: file.originalname,
        })),
      )
      : undefined;

    const reply = await chatWithAI(
      normalizedMessages,
      location,
      uploadedContext,
      uploadedFiles.map((file) => file.originalname),
    );

    return res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    return res.status(500).json({ message: "AI assistant is temporarily unavailable. Please try again." });
  }
}
