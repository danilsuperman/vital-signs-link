import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles, TriangleAlert, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { generateIncidentCase } from "@/lib/incident-summary.functions";
import { addCase } from "@/lib/cases-store";

const INITIAL: UIMessage[] = [
  {
    id: "intro",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Здравствуйте! Я — ИИ-врач Lify. Расскажите, что вас беспокоит? Опишите главную жалобу: что именно происходит и когда началось.",
      },
    ],
  },
];

const partsToText = (m: UIMessage) =>
  m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

export function IncidentChatDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [creating, setCreating] = useState(false);
  const generate = useServerFn(generateIncidentCase);
  const transport = useRef(new DefaultChatTransport({ api: "/api/incident-chat" }));
  const { messages, sendMessage, status, setMessages } = useChat({
    id: "incident-intake",
    messages: INITIAL,
    transport: transport.current,
    onError: (e) => toast.error("Не удалось получить ответ", { description: e.message }),
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const busy = status === "submitted" || status === "streaming";
  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const canCreate = userMsgCount >= 2 && !busy;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const transcript = messages
        .map((m) => `${m.role === "user" ? "Пациент" : "ИИ-врач"}: ${partsToText(m)}`)
        .join("\n");
      const summary = await generate({ data: { transcript } });
      const stored = addCase(summary);
      toast.success(`Карточка ${stored.number} создана`, {
        description: stored.title,
      });
      setMessages(INITIAL);
      onOpenChange(false);
    } catch (e) {
      const err = e as Error;
      toast.error("Не удалось создать карточку", { description: err.message });
    } finally {
      setCreating(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL);
    setInput("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!busy && !creating) onOpenChange(o);
      }}
    >
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-border p-4">
          <DialogTitle className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            ИИ-врач Lify
          </DialogTitle>
          <DialogDescription>
            Короткое интервью — затем создадим карточку обращения с рекомендациями.
          </DialogDescription>
        </DialogHeader>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-xl ${
                  m.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </span>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground shadow-sm"
                }`}
              >
                {partsToText(m) || (busy ? "…" : "")}
              </div>
            </div>
          ))}
          {busy && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> ИИ-врач думает…
            </div>
          )}
        </div>

        <div className="space-y-2 border-t border-border p-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Опишите подробности…"
              rows={2}
              disabled={busy || creating}
              className="flex-1 resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || busy || creating}
              className="rounded-xl"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={busy || creating}
              className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              Начать заново
            </button>
            <div className="flex items-center gap-2">
              {!canCreate && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <TriangleAlert className="h-3 w-3" />
                  Расскажите подробнее (минимум 2 ответа)
                </span>
              )}
              <Button
                onClick={handleCreate}
                disabled={!canCreate || creating}
                className="rounded-xl"
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Создаём…
                  </>
                ) : (
                  "Создать карточку"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
