import type { EscalationEvent } from "../types/fraud";
import Card from "./ui/Card";

type Props = {
  events: EscalationEvent[];
};

function severityTone(severity: EscalationEvent["severity"]): string {
  if (severity === "Critical Risk") return "bg-red-100 text-red-700";
  if (severity === "High Risk") return "bg-amber-100 text-amber-700";
  if (severity === "Medium Risk") return "bg-indigo-100 text-indigo-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function EventLogPanel({ events }: Props) {
  return (
    <Card className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Escalation Event Log</h3>
          <p className="mt-1 text-sm text-gray-500">Deduplicated timeline of critical workflow activity.</p>
        </div>
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
          {events.length} entries
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {events.length === 0 && <p className="text-sm text-gray-500">No events logged yet.</p>}
        {events.slice(0, 6).map((event, index) => (
          <article
            key={event.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800">{event.action}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${severityTone(event.severity)}`}>
                    {event.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                <p className="mt-2 text-sm text-gray-700">{event.messagePreview}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
