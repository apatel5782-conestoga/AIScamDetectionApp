import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

type AreaRoom = {
  code: string;
  name: string;
  activeUsers: number;
  scamsLast30Days: number;
  topScam: string;
};

type ChatMessage = {
  id: string;
  author: string;
  role: "member" | "moderator";
  message: string;
  time: string;
};

const rooms: AreaRoom[] = [
  { code: "ON", name: "Ontario", activeUsers: 128, scamsLast30Days: 318, topScam: "Bank Impersonation" },
  { code: "BC", name: "British Columbia", activeUsers: 94, scamsLast30Days: 201, topScam: "Rental Deposit Fraud" },
  { code: "QC", name: "Quebec", activeUsers: 86, scamsLast30Days: 289, topScam: "Marketplace Fraud" },
  { code: "AB", name: "Alberta", activeUsers: 73, scamsLast30Days: 174, topScam: "Invoice Fraud" },
  { code: "NS", name: "Nova Scotia", activeUsers: 41, scamsLast30Days: 88, topScam: "Charity Fraud" },
];

const initialMessages: Record<string, ChatMessage[]> = {
  ON: [
    { id: "on-1", author: "Maya", role: "member", message: "Anyone else seeing fake CRA refund texts this week?", time: "09:12" },
    { id: "on-2", author: "Jay (Mod)", role: "moderator", message: "Yes, spike in phishing. Reported to anti-fraud center.", time: "09:15" },
    { id: "on-3", author: "Adeel", role: "member", message: "I can share the email headers if helpful.", time: "09:18" },
  ],
  BC: [
    { id: "bc-1", author: "Linh", role: "member", message: "Rental deposit scams targeting students again.", time: "10:04" },
    { id: "bc-2", author: "Priya (Mod)", role: "moderator", message: "Share proof (no personal info). We can build a pattern.", time: "10:06" },
  ],
  QC: [
    { id: "qc-1", author: "Émile", role: "member", message: "Marketplace fraud on used phones. Same buyer script.", time: "08:44" },
  ],
  AB: [
    { id: "ab-1", author: "Kara", role: "member", message: "Invoice fraud emails spoofing oil & gas vendors.", time: "11:31" },
  ],
  NS: [
    { id: "ns-1", author: "Noah", role: "member", message: "Charity call scam pretending to be local hospital.", time: "12:10" },
  ],
};

type UploadItem = {
  id: string;
  fileName: string;
  sizeLabel: string;
  tag: string;
};

const proofSamples: Record<string, UploadItem[]> = {
  ON: [
    { id: "on-proof-1", fileName: "CRA_refund_email.eml", sizeLabel: "182 KB", tag: "Phishing" },
    { id: "on-proof-2", fileName: "spoofed_number.png", sizeLabel: "94 KB", tag: "Caller ID" },
  ],
  BC: [
    { id: "bc-proof-1", fileName: "rental_listing_screenshot.png", sizeLabel: "1.2 MB", tag: "Rental" },
  ],
  QC: [
    { id: "qc-proof-1", fileName: "marketplace_chat.txt", sizeLabel: "14 KB", tag: "Marketplace" },
  ],
  AB: [
    { id: "ab-proof-1", fileName: "invoice_request.pdf", sizeLabel: "310 KB", tag: "Invoice" },
  ],
  NS: [
    { id: "ns-proof-1", fileName: "charity_script.txt", sizeLabel: "9 KB", tag: "Phone" },
  ],
};

type LocalUpload = {
  id: string;
  name: string;
  sizeLabel: string;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
};

export default function CommunityAreaTalkPage() {
  const [activeRoom, setActiveRoom] = useState<AreaRoom>(rooms[0]);
  const [messageInput, setMessageInput] = useState("");
  const [localUploads, setLocalUploads] = useState<LocalUpload[]>([]);
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, ChatMessage[]>>(initialMessages);

  const messages = messagesByRoom[activeRoom.code] || [];
  const proofList = useMemo(() => proofSamples[activeRoom.code] || [], [activeRoom.code]);

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!messageInput.trim()) return;
    const next: ChatMessage = {
      id: crypto.randomUUID(),
      author: "You",
      role: "member",
      message: messageInput.trim(),
      time: new Date().toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setMessagesByRoom((prev) => ({
      ...prev,
      [activeRoom.code]: [...(prev[activeRoom.code] || []), next],
    }));
    setMessageInput("");
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const nextUploads = Array.from(event.target.files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      sizeLabel: formatBytes(file.size),
    }));
    setLocalUploads((prev) => [...nextUploads, ...prev].slice(0, 4));
    event.target.value = "";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community Talk by Area"
        subtitle="Join regional rooms to compare patterns, share proof safely, and co-create next steps."
      />

      <Card className="p-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Live Rooms</p>
              <h2 className="mt-2 text-lg font-semibold text-gray-900">Choose your area</h2>
              <p className="mt-2 text-sm text-gray-600">Room activity updates in near real time.</p>
              <div className="mt-4 space-y-2">
                {rooms.map((room) => {
                  const active = room.code === activeRoom.code;
                  return (
                    <button
                      key={room.code}
                      type="button"
                      onClick={() => setActiveRoom(room)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                        active
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50/60"
                      }`}
                    >
                      <span className="font-semibold">{room.name}</span>
                      <span className="text-xs text-gray-500">{room.activeUsers} online</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Area Snapshot</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{activeRoom.name}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">Scams (30 days)</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{activeRoom.scamsLast30Days}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">Most Reported</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{activeRoom.topScam}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Proof Exchange</p>
              <p className="mt-2 text-sm text-gray-600">Share anonymized evidence to spot repeat patterns.</p>
              <div className="mt-3 space-y-2">
                {proofList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.fileName}</p>
                      <p className="text-xs text-gray-500">{item.sizeLabel}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{item.tag}</span>
                  </div>
                ))}
                {localUploads.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-dashed border-blue-200 bg-blue-50 px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium text-blue-900">{item.name}</p>
                      <p className="text-xs text-blue-600">{item.sizeLabel}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-700">New</span>
                  </div>
                ))}
              </div>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                <input className="hidden" type="file" multiple onChange={handleUpload} />
                + Add proof file
              </label>
              <p className="mt-2 text-xs text-gray-400">Remove personal data before sharing.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Live Room</p>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900">{activeRoom.name} Chat</h3>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {activeRoom.activeUsers} active
                </div>
              </div>
              <div className="mt-4 max-h-[380px] space-y-3 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.author === "You" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      msg.author === "You" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
                    }`}>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-70">
                        <span>{msg.author}</span>
                        {msg.role === "moderator" && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">Mod</span>}
                        <span>{msg.time}</span>
                      </div>
                      <p className="mt-2 leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row">
                <input
                  className="form-input flex-1"
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder="Share a pattern, question, or next step."
                />
                <button className="btn-primary" type="submit">Send</button>
              </form>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-4 text-white shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Solution Board</p>
              <h3 className="mt-2 text-lg font-semibold">What helped people in {activeRoom.name}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <p className="text-sm font-semibold">Block + report immediately</p>
                  <p className="mt-2 text-xs text-blue-100">Call the organization’s official number, not the one in the message.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <p className="text-sm font-semibold">Share evidence patterns</p>
                  <p className="mt-2 text-xs text-blue-100">Headers, invoice layout, or caller scripts help others spot duplicates.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <p className="text-sm font-semibold">Freeze credit if needed</p>
                  <p className="mt-2 text-xs text-blue-100">Use local credit bureaus to prevent rapid account openings.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <p className="text-sm font-semibold">Notify peers fast</p>
                  <p className="mt-2 text-xs text-blue-100">Post an alert in the room to protect new targets.</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-blue-200">Moderators review all shared evidence for privacy.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
