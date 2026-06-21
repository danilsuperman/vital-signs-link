import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Check,
  Clock,
  Copy,
  FileArchive,
  FileText,
  FlaskConical,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  createShareLink,
  type ShareChannel,
  type ShareLink,
  type ShareScope,
} from "@/lib/share-links-store";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialScope?: ShareScope;
  caseTitle?: string;
  context?: string;
};

const SCOPES: {
  id: ShareScope;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "full",
    title: "Полный медицинский контекст",
    desc: "Все обращения, история, выводы ИИ, файлы",
    icon: ShieldCheck,
  },
  {
    id: "case",
    title: "Только активный случай",
    desc: "Один кейс целиком: симптомы, анализы, назначения",
    icon: Activity,
  },
  {
    id: "labs",
    title: "Только анализы",
    desc: "Лабораторные показатели и обследования",
    icon: FlaskConical,
  },
  {
    id: "documents",
    title: "Только документы",
    desc: "Заключения, выписки, изображения",
    icon: FileText,
  },
  {
    id: "temp",
    title: "Ограниченный доступ (48 ч)",
    desc: "Авто-отзыв ссылки через 48 часов",
    icon: Clock,
  },
];

const PREVIEW: Record<ShareScope, string[]> = {
  full: [
    "Контекст пациента (возраст, пол, хронические)",
    "Все активные обращения",
    "Таймлайн событий",
    "Клинические выводы ИИ",
    "Рекомендации врачей",
    "Медицинские файлы",
  ],
  case: [
    "Контекст пациента",
    "Один активный случай",
    "Таймлайн по этому случаю",
    "Выводы ИИ и рекомендации",
    "Файлы по случаю",
  ],
  labs: ["Контекст пациента", "Все анализы и обследования", "Динамика показателей"],
  documents: ["Контекст пациента", "PDF, заключения, изображения"],
  temp: [
    "Контекст пациента",
    "Активные обращения",
    "Ключевые анализы",
    "Доступ автоматически закроется через 48 часов",
  ],
};

const CHANNELS: { id: ShareChannel; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "link", label: "Ссылка", icon: LinkIcon },
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

export function ShareDialog({ open, onOpenChange, initialScope = "full", caseTitle, context }: Props) {
  const [scope, setScope] = useState<ShareScope>(initialScope);
  const [channel, setChannel] = useState<ShareChannel>("link");
  const [ttl, setTtl] = useState<string>("none");
  const [recipient, setRecipient] = useState("");
  const [link, setLink] = useState<ShareLink | null>(null);

  useEffect(() => {
    if (open) {
      setScope(initialScope);
      setChannel("link");
      setRecipient("");
      setLink(null);
      setTtl(initialScope === "temp" ? "48" : "none");
    }
  }, [open, initialScope]);

  useEffect(() => {
    if (scope === "temp" && ttl === "none") setTtl("48");
  }, [scope, ttl]);

  const previewItems = useMemo(() => PREVIEW[scope], [scope]);

  const handleCreate = () => {
    const ttlHours = ttl === "none" ? null : parseInt(ttl, 10);
    const created = createShareLink({
      scope,
      channel,
      caseTitle,
      recipient: recipient || undefined,
      ttlHours,
    });
    setLink(created);
    toast.success("Ссылка создана", { description: created.url });
  };

  const handleCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link.url);
    toast.success("Ссылка скопирована");
  };

  const handleSend = () => {
    if (!link) return;
    if (channel === "email") {
      const subj = encodeURIComponent("Медицинский контекст пациента — Lify");
      const body = encodeURIComponent(`Доступ к медицинскому контексту:\n${link.url}`);
      window.location.href = `mailto:${recipient}?subject=${subj}&body=${body}`;
    } else if (channel === "whatsapp") {
      const text = encodeURIComponent(`Медицинский контекст пациента (Lify):\n${link.url}`);
      const phone = recipient.replace(/\D/g, "");
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            Поделиться медицинским контекстом
          </DialogTitle>
          <DialogDescription>
            {context
              ? `Контекст: ${context}. `
              : ""}
            Врач увидит клиническую картину, а не сырые данные.
          </DialogDescription>
        </DialogHeader>

        {/* Уровни доступа */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Уровень доступа
          </div>
          <div className="grid gap-2">
            {SCOPES.map((s) => {
              const active = scope === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScope(s.id)}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                    active
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-card hover:bg-muted/50"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                      active ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <s.icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                  {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Превью что увидит врач */}
        <div className="rounded-xl bg-muted/50 p-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Что увидит врач
          </div>
          <ul className="space-y-1 text-xs text-foreground/80">
            {previewItems.map((p) => (
              <li key={p} className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Канал */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Кому отправляем
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CHANNELS.map((c) => {
              const active = channel === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChannel(c.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    active
                      ? "gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "bg-muted text-foreground hover:bg-secondary"
                  }`}
                >
                  <c.icon className="h-4 w-4" /> {c.label}
                </button>
              );
            })}
          </div>
          {channel !== "link" && (
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={channel === "email" ? "doctor@clinic.ru" : "+7 999 000 00 00"}
              className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          )}
        </div>

        {/* Срок действия */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Срок действия
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { v: "24", l: "24 часа" },
              { v: "48", l: "48 часов" },
              { v: "168", l: "7 дней" },
              { v: "none", l: "Бессрочно" },
            ].map((opt) => {
              const active = ttl === opt.v;
              const disabled = scope === "temp" && opt.v === "none";
              return (
                <button
                  key={opt.v}
                  type="button"
                  disabled={disabled}
                  onClick={() => setTtl(opt.v)}
                  className={`rounded-xl px-2 py-2 text-xs font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-secondary"
                  } ${disabled ? "opacity-30" : ""}`}
                >
                  {opt.l}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ссылка */}
        {!link ? (
          <button
            type="button"
            onClick={handleCreate}
            className="w-full rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.01]"
          >
            Создать ссылку
          </button>
        ) : (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <LinkIcon className="h-3 w-3" /> Ссылка готова
            </div>
            <div className="mt-1 break-all rounded-xl bg-card p-2 text-xs font-medium text-foreground">
              {link.url}
            </div>
            {link.expiresAt && (
              <div className="mt-1 text-[11px] text-muted-foreground">
                Истекает {new Date(link.expiresAt).toLocaleString("ru-RU")}
              </div>
            )}
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Copy className="h-3.5 w-3.5" /> Копировать
              </button>
              <button
                type="button"
                onClick={() => toast("QR-код откроется в полной версии")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <QrCode className="h-3.5 w-3.5" /> QR
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
              >
                <FileArchive className="h-3.5 w-3.5" /> Отправить
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
