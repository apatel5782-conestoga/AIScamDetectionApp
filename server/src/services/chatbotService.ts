import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

const SYSTEM_PROMPT = `You are AIScamDetectionApp, an expert cybersecurity assistant specializing in fraud detection, scam identification, and online safety.

Your capabilities:
- Analyze suspicious messages, emails, links, and content for fraud indicators
- Explain different types of scams (phishing, romance scams, investment fraud, tech support scams, etc.)
- Provide actionable advice on what to do if someone has been scammed
- Help users understand if something is a scam
- Answer questions about cybersecurity and online safety

Guidelines:
- Be clear, concise, and helpful
- When analyzing content, explain your reasoning
- Always recommend preserving evidence and not engaging with scammers
- If someone has lost money, direct them to contact their bank and local authorities
- Keep responses focused and practical
- Use plain language, not overly technical jargon
- If the user pastes suspicious content, analyze it directly

You are embedded in an AI Scam Detection platform. Users may paste suspicious messages directly in the chat for you to analyze.`;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getLatestUserMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content.trim() || "";
}

function buildFallbackReply(messages: ChatMessage[], userLocation?: string): string {
  const latestUserMessage = getLatestUserMessage(messages);
  const locationNote = userLocation?.trim()
    ? ` If you're in ${userLocation.trim()}, I can also tailor reporting steps to that area once the AI connection is restored.`
    : "";

  if (!latestUserMessage) {
    return `I'm having trouble reaching the live AI service right now, but I can still help with general scam-safety guidance.${locationNote}`;
  }

  const lower = latestUserMessage.toLowerCase();
  const warnings: string[] = [];
  const actions: string[] = [
    "Do not reply, click links, call numbers in the message, or send money.",
    "Preserve screenshots, sender details, phone numbers, URLs, and timestamps.",
    "Verify the claim through an official website or phone number you look up independently.",
  ];

  if (/urgent|immediately|act now|final notice|last chance|suspended|locked/.test(lower)) {
    warnings.push("It uses urgency or threat language to push a fast decision.");
  }
  if (/password|passcode|otp|security code|pin|verify your account|login/.test(lower)) {
    warnings.push("It asks for sensitive account or verification details.");
    actions.push("If you already shared credentials or a one-time code, change passwords and secure MFA immediately.");
  }
  if (/http:\/\/|https:\/\/|www\.|bit\.ly|tinyurl/.test(lower)) {
    warnings.push("It contains a link that should be treated as suspicious until verified.");
  }
  if (/bank|irs|government|police|microsoft|apple|paypal|amazon|crypto|investment/.test(lower)) {
    warnings.push("It may be impersonating a trusted organization or financial service.");
  }
  if (/gift card|wire transfer|bitcoin|crypto|payment|send money/.test(lower)) {
    warnings.push("It includes an unusual payment request, which is a common scam signal.");
    actions.push("If money was sent, contact your bank or payment provider right away and ask about fraud recovery options.");
  }

  if (warnings.length === 0) {
    warnings.push("I can't confirm legitimacy without the live model, so treat it cautiously until independently verified.");
  }

  return [
    "I'm having trouble reaching the live AI service right now, but here is a quick safety read:",
    `Likely warning signs: ${warnings.join(" ")}`,
    `What to do now: ${actions.slice(0, 4).join(" ")}`,
    `Paste the exact message again in a moment and I'll re-check it once the AI connection is back.${locationNote}`,
  ].join("\n\n");
}

export async function chatWithAI(messages: ChatMessage[], userLocation?: string): Promise<string> {
  const systemContent = userLocation
    ? `${SYSTEM_PROMPT}\n\nUser is located in: ${userLocation}. Tailor any local reporting advice accordingly.`
    : SYSTEM_PROMPT;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    return response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI chatbot fallback triggered:", error);
    return buildFallbackReply(messages, userLocation);
  }
}
