import type { EscalationEvent } from "../types/fraud";

const memoryEvents: EscalationEvent[] = [];
const STORAGE_KEY = "fraud-escalation-events";
const DUPLICATE_WINDOW_MS = 10000;

function getEventFingerprint(event: EscalationEvent): string {
  return [event.action, event.severity, event.riskScore, event.messagePreview.slice(0, 80)].join("|");
}

function isDuplicate(existing: EscalationEvent[], incoming: EscalationEvent): boolean {
  const incomingTime = new Date(incoming.timestamp).getTime();
  const incomingFingerprint = getEventFingerprint(incoming);

  return existing.some((event) => {
    const sameFingerprint = getEventFingerprint(event) === incomingFingerprint;
    const existingTime = new Date(event.timestamp).getTime();
    const isInWindow = Math.abs(incomingTime - existingTime) <= DUPLICATE_WINDOW_MS;
    return sameFingerprint && isInWindow;
  });
}

export const eventLogger = {
  log(event: EscalationEvent): void {
    const current = eventLogger.getAll();

    if (isDuplicate(current, event)) {
      return;
    }

    memoryEvents.unshift(event);

    if (typeof window !== "undefined") {
      const merged = [event, ...current].slice(0, 100);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
  },

  getAll(): EscalationEvent[] {
    if (typeof window === "undefined") {
      return memoryEvents;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return memoryEvents;
    }

    try {
      return JSON.parse(raw) as EscalationEvent[];
    } catch {
      return memoryEvents;
    }
  },
};
