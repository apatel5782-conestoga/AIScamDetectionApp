import { useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "../services/api";
import LiveAiRobot from "./ui/LiveAiRobot";

type ChatAttachment = {
  name: string;
  size: number;
  type: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
};

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getAttachmentKindLabel(attachment: ChatAttachment) {
  if (attachment.type.startsWith("image/")) return "Image";
  if (attachment.type.includes("pdf")) return "PDF";
  if (attachment.type.includes("message")) return "Email";
  return "File";
}

function getAttachmentInitial(attachment: ChatAttachment) {
  return getAttachmentKindLabel(attachment).slice(0, 1);
}

function SelectedFilePreview({ file, label }: { file: File; label: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!previewUrl) {
    return (
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[10px] font-semibold uppercase text-blue-700">
        {label}
      </span>
    );
  }

  return <img src={previewUrl} alt={file.name} className="h-10 w-10 rounded-xl object-cover" />;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm FraudWatch. Upload a screenshot, email, or document and I can help assess whether it looks fake, real, or suspicious.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputId = "chatbot-file-input";

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, selectedFiles.length]);

  const selectedAttachments = useMemo<ChatAttachment[]>(
    () =>
      selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
      })),
    [selectedFiles],
  );

  const addFiles = (files: FileList | null) => {
    if (!files) return;

    const notices: string[] = [];
    let addedCount = 0;

    setSelectedFiles((prev) => {
      const next = [...prev];

      for (const file of Array.from(files)) {
        if (next.length >= MAX_FILES) {
          notices.push(`You can attach up to ${MAX_FILES} files at a time.`);
          break;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          notices.push(`${file.name} is larger than 25 MB.`);
          continue;
        }

        const exists = next.some(
          (item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified,
        );

        if (!exists) {
          next.push(file);
          addedCount += 1;
        } else {
          notices.push(`${file.name} is already selected.`);
        }
      }

      return next;
    });

    setUploadFeedback(notices[0] ?? (addedCount > 0 ? `Added ${addedCount} file${addedCount === 1 ? "" : "s"} to the chat.` : null));
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    setUploadFeedback(null);
  };

  const openFileDialog = () => {
    if (loading) return;

    setUploadFeedback(null);

    const input = fileInputRef.current;
    if (!input) return;

    const pickerCapableInput = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof pickerCapableInput.showPicker === "function") {
      pickerCapableInput.showPicker();
      return;
    }

    input.click();
  };

  const sendMessage = async () => {
    const text = input.trim();
    if ((text.length === 0 && selectedFiles.length === 0) || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text || "Please analyze the uploaded file(s) and tell me whether they look fake, real, or suspicious.",
      attachments: selectedAttachments.length > 0 ? selectedAttachments : undefined,
    };

    const updatedMessages = [...messages, userMsg];
    const conversationMessages = updatedMessages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages(updatedMessages);
    setInput("");
    setSelectedFiles([]);
    setUploadFeedback(null);
    setLoading(true);

    try {
      const hasFiles = selectedFiles.length > 0;
      const requestBody = hasFiles
        ? (() => {
            const formData = new FormData();
            formData.append("messages", JSON.stringify(conversationMessages));
            selectedFiles.forEach((file) => formData.append("files", file));
            return formData;
          })()
        : JSON.stringify({
            messages: conversationMessages,
          });

      const { reply } = await apiRequest<{ reply: string }>("/chatbot", {
        method: "POST",
        body: requestBody,
      });

      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? `I hit an error while sending that message: ${error.message}`
          : "Sorry, I'm having trouble connecting. Please try again in a moment.";

      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDraggingFiles(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsDraggingFiles(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFiles(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[70] flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group flex h-[5.6rem] w-[5.6rem] items-center justify-center rounded-full bg-[linear-gradient(135deg,#0F172A_0%,#134E4A_100%)] text-white shadow-[0_22px_55px_rgba(15,23,42,0.34)] ring-1 ring-teal-300/25 transition hover:translate-y-[-2px] hover:shadow-[0_26px_64px_rgba(15,23,42,0.42)]"
          title="Open FraudWatch Chat"
        >
          <span className="flex h-[4.45rem] w-[4.45rem] items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <LiveAiRobot size="3.7rem" className="scale-[1.06]" />
            )}
          </span>
        </button>
      </div>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[25rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[28px] border border-blue-100 bg-white/95 shadow-[0_24px_80px_rgba(37,99,235,0.22)] backdrop-blur"
          style={{ height: "560px" }}
        >
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0F172A_0%,#134E4A_100%)] px-4 py-4">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -right-10 top-0 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
              <div className="absolute left-10 top-10 h-16 w-16 rounded-full bg-teal-200/30 blur-xl" />
            </div>

            <div className="relative flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/18 shadow-inner">
                <LiveAiRobot size="2.9rem" talking={loading} />
              </div>

              <div>
                <p className="text-base font-semibold tracking-tight text-white">FraudWatch</p>
                <p className="text-xs font-medium text-teal-50/85">AI scam triage with image and file review</p>
              </div>

            </div>

            <div className="relative mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/20 bg-white/14 px-2.5 py-1 text-[11px] font-medium text-white/95">Photo scans</span>
              <span className="rounded-full border border-white/20 bg-white/14 px-2.5 py-1 text-[11px] font-medium text-white/95">PDF & email review</span>
              <span className="rounded-full border border-white/20 bg-white/14 px-2.5 py-1 text-[11px] font-medium text-white/95">Fake or real guidance</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.28),_transparent_38%),linear-gradient(180deg,#f8fbff_0%,#ffffff_45%,#f8fafc_100%)] px-4 py-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-[linear-gradient(135deg,#2563eb_0%,#3b82f6_100%)] text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)]"
                      : "rounded-bl-md border border-white/80 bg-white/88 text-slate-800 shadow-[0_10px_24px_rgba(148,163,184,0.16)] backdrop-blur"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {msg.attachments.map((attachment) => (
                        <div
                          key={`${attachment.name}-${attachment.size}`}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${
                            msg.role === "user"
                              ? "bg-white/15 text-blue-50"
                              : "border border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 text-[10px] font-semibold uppercase">
                            {getAttachmentInitial(attachment)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{attachment.name}</p>
                            <p className="truncate opacity-80">
                              {getAttachmentKindLabel(attachment)} · {formatFileSize(attachment.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 rounded-2xl rounded-bl-md border border-white/80 bg-white/88 px-4 py-3 shadow-[0_10px_24px_rgba(148,163,184,0.16)]">
                  <LiveAiRobot size="2.4rem" talking />
                  <div>
                    <p className="text-sm font-medium text-slate-700">FraudWatch is thinking...</p>
                    <span className="mt-1 flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-200/80 bg-white/92 p-3 backdrop-blur">
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              multiple
              className="sr-only"
              accept="image/*,.pdf,.txt,.csv,.json,.eml,.msg,.doc,.docx"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />

            {selectedFiles.length > 0 && (
              <div className="mb-3 rounded-2xl border border-blue-100 bg-[linear-gradient(180deg,#eff6ff_0%,#f8fbff_100%)] p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Ready to scan</p>
                  <p className="text-[11px] text-blue-500">
                    {selectedFiles.length}/{MAX_FILES} files
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-white px-2.5 py-2 text-xs text-blue-800 shadow-sm"
                    >
                      <SelectedFilePreview file={file} label={getAttachmentInitial(selectedAttachments[index])} />
                      <div className="min-w-0">
                        <p className="max-w-28 truncate font-medium">{file.name}</p>
                        <p className="text-blue-500">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(index)}
                        className="rounded-full p-0.5 text-blue-600 transition-colors hover:bg-blue-100"
                        aria-label={`Remove ${file.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadFeedback && (
              <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {uploadFeedback}
              </div>
            )}

            <div
              className={`rounded-[24px] border bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition ${
                isDraggingFiles ? "border-teal-400 bg-teal-50/40" : "border-slate-200"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex items-end gap-2">
                <div className="self-end">
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_100%)] text-blue-700 transition hover:scale-[1.02] hover:bg-blue-50 ${
                      loading ? "pointer-events-none opacity-40" : ""
                    }`}
                    title="Add photos or files"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <textarea
                  className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white"
                  rows={2}
                  placeholder="Ask about a scam or upload screenshots, files, or emails..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                />

                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={(!input.trim() && selectedFiles.length === 0) || loading}
                  className="flex h-11 w-11 items-center justify-center self-end rounded-2xl bg-[linear-gradient(135deg,#2563eb_0%,#3b82f6_100%)] text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_16px_36px_rgba(37,99,235,0.34)] disabled:opacity-40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 px-1">
                <p className="text-[11px] text-slate-400">Press Enter to send. Shift+Enter for newline.</p>
                <p className="text-right text-[11px] font-medium text-blue-500">Click + or drag files here. Up to {MAX_FILES} files, 25 MB each.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
