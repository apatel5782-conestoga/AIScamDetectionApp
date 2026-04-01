import OpenAI from "openai";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export async function extractTextFromFile(buffer: Buffer, mimetype: string, filename: string): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  // Plain text files
  if (mimetype === "text/plain" || ext === "txt" || ext === "csv" || ext === "json") {
    return buffer.toString("utf-8").slice(0, 8000);
  }

  // PDF files
  if (mimetype === "application/pdf" || ext === "pdf") {
    try {
      const data = await pdfParse(buffer);
      return data.text.slice(0, 8000);
    } catch {
      return `[PDF file: ${filename} — could not extract text]`;
    }
  }

  // Email files — parse basic text from .eml
  if (ext === "eml" || mimetype === "message/rfc822") {
    const raw = buffer.toString("utf-8");
    const bodyStart = raw.indexOf("\r\n\r\n");
    const body = bodyStart >= 0 ? raw.slice(bodyStart + 4) : raw;
    return body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 8000);
  }

  // Images — use GPT-4 Vision
  if (mimetype.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) {
    try {
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimetype || "image/jpeg"};base64,${base64}`;
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Extract and transcribe all text visible in this image. If this looks like a scam, phishing email, or suspicious message, describe what you see. Be thorough." },
              { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            ],
          },
        ],
        max_tokens: 1500,
      });
      return response.choices[0]?.message?.content || `[Image: ${filename}]`;
    } catch {
      return `[Image file: ${filename} — could not extract text]`;
    }
  }

  // Unsupported type — return filename reference
  return `[File: ${filename} (${mimetype}) — content type not supported for extraction]`;
}

export async function extractTextFromFiles(files: Array<{ buffer: Buffer; mimetype: string; originalname: string }>): Promise<string> {
  if (files.length === 0) return "";

  const results = await Promise.all(
    files.map(async (file) => {
      const text = await extractTextFromFile(file.buffer, file.mimetype, file.originalname);
      return `--- File: ${file.originalname} ---\n${text}`;
    }),
  );

  return results.join("\n\n");
}
