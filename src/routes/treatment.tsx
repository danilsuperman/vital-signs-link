import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  ChevronRight,
  FileText,
  Pill,
  Share2,
  Stethoscope,
  Users,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import { Tabs } from "@/components/ui/section-tabs";
import { ShareDialog } from "@/components/share-dialog";
import type { ShareScope } from "@/lib/share-links-store";
import { useCases, type StoredCase } from "@/lib/cases-store";

export const Route = createFileRoute("/treatment")({
  head: () => ({
    meta: [
      { title: "Lify — Лечение" },
      { name: "description", content: "Все случаи лечения: активные, завершённые, архив." },
    ],
  }),
  component: TreatmentPage,
});

type RichCase = {
  title: string;
  number: string;
  diagnosis: string;
  specialist: string;
  next: string;
  progress: number;
  tone: "primary" | "warning" | "accent" | "success" | "default";
  status: string;
  tests: number;
  drugs: number;
  team: number;
};

const ACTIVE_CASES: RichCase[] = [
  {
    title: "Варикоз",
    number: "№121",
    diagnosis: "Варикоз нижних конечностей",
    specialist: "Артем Сергеевич Петров · Флеболог",
    next: "Прием 15 апреля в 13:40",
    progress: 65,
    tone: "primary",
    status: "Лечение",
    tests: 4,
    drugs: 2,
    team: 2,
  },
  {
    title: "Гипертония",
    number: "№118",
    diagnosis: "Артериальная гипертензия I ст.",
    specialist: "Смирнова О.Н. · Кардиолог",
    next: "Контроль АД, 12 апреля",
    progress: 40,
    tone: "warning",
    status: "Контроль",
    tests: 3,
    drugs: 1,
    team: 1,
  },
  {
    title: "Дефицит железа",
    number: "№124",
    diagnosis: "Латентный дефицит железа",
    specialist: "Иванов И.И. · Терапевт",
    next: "Повторить ферритин через 2 недели",
    progress: 25,
    tone: "accent",
    status: "Диагностика",
    tests: 2,
    drugs: 1,
    team: 1,
  },
];

const DONE_CASES: RichCase[] = [
  {
    title: "ОРВИ",
    number: "№098",
    diagnosis: "Острая респираторная вирусная инфекция",
    specialist: "Иванов И.И. · Терапевт",
    next: "Закрыт 02.03.2026",
    progress: 100,
    tone: "success",
    status: "Завершено",
    tests: 1,
    drugs: 3,
    team: 1,
  },
];

const ARCHIVE_CASES: RichCase[] = [
  {
    title: "Ангина",
    number: "№042",
    diagnosis: "Острый тонзиллит",
    specialist: "Терапевт",
    next: "Архивирован 15.11.2025",
    progress: 100,
    tone: "default",
    status: "Архив",
    tests: 1,
    drugs: 2,
    team: 1,
  },
];

function TreatmentPage() {
  const [share, setShare] = useState<{ scope: ShareScope; caseTitle?: string; context?: string } | null>(null);
  const onShare = (name: string) => setShare({ scope: "case", caseTitle: name, context: name });
  const userCases = useCases();

  return (
    <AppShell>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Раздел</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Лечение</h1>
          <p className="mt-1 text-sm text-muted-foreground">Все ваши случаи в одном месте</p>
        </div>
        <button
          type="button"
          onClick={() => setShare({ scope: "full", context: "Все случаи лечения" })}
          className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          <Share2 className="h-4 w-4" /> Поделиться медкартой
        </button>
      </header>

      <Tabs
        tabs={[
          {
            id: "active",
            label: "Активные",
            content: <ActiveList items={ACTIVE_CASES} userCases={userCases} onShare={onShare} />,
          },
          { id: "done", label: "Завершённые", content: <CompactList items={DONE_CASES} onShare={onShare} /> },
          { id: "archive", label: "Архив", content: <CompactList items={ARCHIVE_CASES} onShare={onShare} /> },
        ]}
      />

      <ShareDialog
        open={share !== null}
        onOpenChange={(o) => !o && setShare(null)}
        initialScope={share?.scope ?? "case"}
        caseTitle={share?.caseTitle}
        context={share?.context}
      />
    </AppShell>
  );
}

function ActiveList({
  items,
  userCases,
  onShare,
}: {
  items: RichCase[];
  userCases: StoredCase[];
  onShare: (name: string) => void;
}) {
  if (items.length === 0 && userCases.length === 0)
    return <p className="text-sm text-muted-foreground">Нет активных случаев.</p>;
  return (
    <div className="space-y-3">
      {userCases.map((c) => (
        <UserCaseCard key={c.id} c={c} onShare={() => onShare(c.title)} />
      ))}
      {items.map((c) => (
        <CaseCard key={c.number} c={c} onShare={() => onShare(c.title)} />
      ))}
    </div>
  );
}

function CaseCard({ c, onShare }: { c: RichCase; onShare: () => void }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-4 w-4" />
          </div>
          <div className="text-base font-semibold text-foreground">{c.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone={c.tone}>{c.status}</StatusBadge>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full gradient-primary"
              style={{ width: `${c.progress}%` }}
            />
          </div>
          <button
            type="button"
            onClick={onShare}
            title="Поделиться кейсом"
            className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-card text-foreground hover:bg-muted"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-[140px_1fr] gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-muted-foreground">Номер обращения:</dt>
        <dd className="font-medium text-foreground">{c.number}</dd>
        <dt className="text-muted-foreground">Диагноз:</dt>
        <dd className="font-medium text-foreground">{c.diagnosis}</dd>
        <dt className="text-muted-foreground">Специалист:</dt>
        <dd className="font-medium text-foreground">{c.specialist}</dd>
        <dt className="text-muted-foreground">Следующее действие:</dt>
        <dd className="font-medium text-foreground">{c.next}</dd>
      </dl>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Mini icon={FileText} label="Анализы" value={String(c.tests)} />
        <Mini icon={Pill} label="Препараты" value={String(c.drugs)} />
        <Mini icon={Users} label="Команда" value={String(c.team)} />
      </div>

      <Link
        to="/case/$id"
        params={{ id: c.number.replace(/^№/, "") }}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl gradient-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
      >
        <FileText className="h-4 w-4" /> Открыть карточку обращения
      </Link>
    </div>
  );
}

function UserCaseCard({ c, onShare }: { c: StoredCase; onShare: () => void }) {
  const urgencyMap = {
    low: { label: "Низкая", cls: "bg-success/20 text-success-foreground" },
    medium: { label: "Средняя", cls: "bg-warning/20 text-warning-foreground" },
    high: { label: "Высокая", cls: "bg-warning/30 text-warning-foreground" },
    critical: { label: "Критично", cls: "bg-critical/15 text-critical" },
  } as const;
  const u = urgencyMap[c.urgency];
  return (
    <div className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-base font-semibold text-foreground">{c.title}</div>
            <div className="text-[11px] text-muted-foreground">{c.number} · Создано ИИ-врачом</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${u.cls}`}>{u.label}</span>
          <button
            type="button"
            onClick={onShare}
            title="Поделиться кейсом"
            className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-card text-foreground hover:bg-muted"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-foreground/80">{c.summary}</p>

      {c.recommendations.length > 0 && (
        <div className="mt-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Рекомендации
          </div>
          <ul className="mt-1 space-y-0.5 text-xs text-foreground/80">
            {c.recommendations.slice(0, 4).map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 text-primary shrink-0" /> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl gradient-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
      >
        <FileText className="h-4 w-4" /> Открыть карточку обращения
      </button>
    </div>
  );
}

function CompactList({ items, onShare }: { items: RichCase[]; onShare: (n: string) => void }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">Нет записей.</p>;
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <article key={c.number} className="surface-card surface-card-hover p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">{c.title}</h3>
                <div className="text-xs text-muted-foreground">{c.specialist}</div>
                <div className="text-[11px] text-muted-foreground">{c.number} · {c.next}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge tone={c.tone}>{c.status}</StatusBadge>
              <button
                type="button"
                onClick={() => onShare(c.title)}
                title="Поделиться"
                className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-card text-foreground hover:bg-muted"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Mini({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <div className="mt-1 text-base font-semibold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

// keep Link import alive for future use
export type _LinkUsed = typeof Link;
export type _ChevronUsed = typeof ChevronRight;
