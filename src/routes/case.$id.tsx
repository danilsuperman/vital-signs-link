import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskRound,
  MessageSquare,
  Pill,
  Share2,
  Sparkles,
  Stethoscope,
  Users,
  Video,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import { Tabs } from "@/components/ui/section-tabs";
import { ShareDialog } from "@/components/share-dialog";
import { useCases } from "@/lib/cases-store";
import doctorPhoto from "@/assets/doctor-petrov.jpg";

export const Route = createFileRoute("/case/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Lify — Случай №${params.id}` },
      { name: "description", content: "Карточка медицинского случая: динамика, назначения, документы, команда." },
    ],
  }),
  component: CasePage,
});

type SampleCase = {
  id: string;
  number: string;
  title: string;
  diagnosis: string;
  icd: string;
  stage: string;
  specialist: string;
  specialistRole: string;
  next: string;
  progress: number;
  tone: "primary" | "warning" | "accent" | "success" | "default";
  status: string;
  opened: string;
  summary: string;
};

const SAMPLE: Record<string, SampleCase> = {
  "121": {
    id: "121",
    number: "№121",
    title: "Варикоз",
    diagnosis: "Варикозное расширение вен нижних конечностей",
    icd: "I83.9",
    stage: "C2 по CEAP",
    specialist: "Артем Сергеевич Петров",
    specialistRole: "Флеболог · Хирург",
    next: "Видеоконсультация 15 апреля в 13:40",
    progress: 65,
    tone: "primary",
    status: "Лечение",
    opened: "3 июня 2025",
    summary:
      "Положительная динамика на фоне приёма Детралекса и компрессионного трикотажа. Боль и отёчность к концу дня уменьшились. Продолжаем консервативное лечение, контроль через 3 месяца.",
  },
  "118": {
    id: "118",
    number: "№118",
    title: "Гипертония",
    diagnosis: "Артериальная гипертензия I ст.",
    icd: "I10",
    stage: "Степень I, риск 2",
    specialist: "Ольга Николаевна Смирнова",
    specialistRole: "Кардиолог",
    next: "Контроль АД 12 апреля",
    progress: 40,
    tone: "warning",
    status: "Контроль",
    opened: "12 февраля 2026",
    summary:
      "Стабильная компенсация на фоне коррекции образа жизни. Эпизодически утренние подъёмы до 145/95. Назначен дневник давления и контрольный визит через 2 недели.",
  },
  "124": {
    id: "124",
    number: "№124",
    title: "Дефицит железа",
    diagnosis: "Латентный дефицит железа",
    icd: "E61.1",
    stage: "Ферритин 18 нг/мл",
    specialist: "Иван Иванович Иванов",
    specialistRole: "Терапевт",
    next: "Контроль ферритина через 2 недели",
    progress: 25,
    tone: "accent",
    status: "Диагностика",
    opened: "1 апреля 2026",
    summary:
      "Утомляемость, выпадение волос. Начата терапия пероральным железом, контрольный анализ ферритина и ОАК через 14 дней.",
  },
};

function CasePage() {
  const { id } = useParams({ from: "/case/$id" });
  const userCases = useCases();
  const stored = userCases.find((c) => c.id === id);
  const sample = SAMPLE[id];
  const [shareOpen, setShareOpen] = useState(false);

  if (!stored && !sample) {
    return (
      <AppShell>
        <div className="surface-card p-6 text-center">
          <p className="text-sm text-muted-foreground">Случай не найден.</p>
          <Link to="/treatment" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> К списку случаев
          </Link>
        </div>
      </AppShell>
    );
  }

  const title = stored?.title ?? sample!.title;
  const number = stored?.number ?? sample!.number;
  const diagnosis = stored ? stored.complaint : sample!.diagnosis;
  const summary = stored?.summary ?? sample!.summary;
  const recommendations = stored?.recommendations ?? [
    "Компрессионный трикотаж 2-го класса весь день",
    "Ограничение длительного стояния",
    "Контроль массы тела",
    "Лёгкая физическая активность ежедневно",
  ];
  const tests = stored?.tests ?? [
    "УЗДГ вен нижних конечностей",
    "Общий анализ крови",
    "Коагулограмма",
  ];
  const specialists = stored?.specialists ?? [sample!.specialistRole];
  const progress = sample?.progress ?? 50;
  const status = sample?.status ?? "В работе";
  const tone = sample?.tone ?? "primary";
  const opened = sample?.opened ?? "Сегодня";
  const specialistName = sample?.specialist ?? "ИИ-врач Lify";
  const specialistRole = sample?.specialistRole ?? "Первичный осмотр";
  const next = sample?.next ?? "Запись к профильному специалисту";

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link to="/treatment" className="inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Лечение
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{title} {number}</span>
      </div>

      {/* Hero header */}
      <section className="surface-card mb-5 overflow-hidden">
        <div className="gradient-primary px-5 py-5 text-primary-foreground">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] opacity-90">
                Случай {number} · открыт {opened}
              </div>
              <h1 className="mt-1 truncate text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              <p className="mt-1 text-sm opacity-90">{diagnosis}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur transition-colors hover:bg-white/25"
              >
                <Share2 className="h-4 w-4" /> Поделиться
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs font-semibold">{progress}%</div>
            <StatusBadge tone={tone}>{status}</StatusBadge>
          </div>
        </div>
        <div className="grid gap-3 px-5 py-4 sm:grid-cols-3">
          <Stat icon={Stethoscope} label="Ведущий специалист" value={specialistName} sub={specialistRole} />
          <Stat icon={CalendarClock} label="Следующее действие" value={next} />
          <Stat icon={Activity} label="Стадия / маркер" value={sample?.stage ?? "—"} sub={`МКБ ${sample?.icd ?? "—"}`} />
        </div>
      </section>

      {/* Quick actions */}
      <section className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <QuickAction icon={MessageSquare} label="Чат с врачом" />
        <QuickAction icon={Video} label="Видеоконсультация" />
        <QuickAction icon={FlaskRound} label="Сдать анализы" />
        <QuickAction icon={Plus} label="Добавить запись" />
      </section>

      <Tabs
        tabs={[
          {
            id: "overview",
            label: "Обзор",
            content: (
              <OverviewTab
                summary={summary}
                recommendations={recommendations}
                tests={tests}
                specialists={specialists}
              />
            ),
          },
          { id: "timeline", label: "История", content: <TimelineTab /> },
          { id: "meds", label: "Препараты", content: <MedsTab /> },
          { id: "tests", label: "Анализы", content: <TestsTab tests={tests} /> },
          { id: "docs", label: "Документы", content: <DocsTab /> },
          { id: "team", label: "Команда", content: <TeamTab name={specialistName} role={specialistRole} /> },
        ]}
      />

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        initialScope="case"
        caseTitle={title}
        context={`${title} ${number}`}
      />
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="truncate text-sm font-semibold text-foreground">{value}</div>
        {sub && <div className="truncate text-[11px] text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label }: { icon: typeof Activity; label: string }) {
  return (
    <button
      type="button"
      className="surface-card surface-card-hover flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-foreground"
    >
      <Icon className="h-4 w-4 text-primary" /> {label}
    </button>
  );
}

function OverviewTab({
  summary,
  recommendations,
  tests,
  specialists,
}: {
  summary: string;
  recommendations: string[];
  tests: string[];
  specialists: string[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="surface-card p-4">
          <SectionTitle title="Резюме случая" hint="Что мы знаем сегодня" />
          <p className="text-sm leading-relaxed text-foreground/85">{summary}</p>
        </div>
        <div className="surface-card p-4">
          <SectionTitle title="Рекомендации" />
          <ul className="space-y-2 text-sm">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="text-foreground/85">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-4">
        <div className="surface-card p-4">
          <SectionTitle title="Назначенные анализы" />
          <ul className="space-y-1.5 text-sm text-foreground/85">
            {tests.map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <FlaskRound className="h-3.5 w-3.5 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-card p-4">
          <SectionTitle title="Специалисты" />
          <ul className="space-y-1.5 text-sm text-foreground/85">
            {specialists.map((s, i) => (
              <li key={i} className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-primary" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const TIMELINE = [
  {
    when: "15 июня · 13:40",
    title: "Видеоконсультация — Петров А.С.",
    note: "Положительная динамика. Продолжить Детралекс до 30 июня. Компрессионный трикотаж весь день. Сдать повторный ОАК через 2 недели.",
    chips: ["Видеоконсультация", "Динамика положит."],
  },
  {
    when: "8 июня · 14:00",
    title: "Очная консультация — Петров А.С.",
    note: "Первичный приём хирурга. Диагноз: C2 по CEAP. Назначен Детралекс 1000 мг на 30 дней, компрессионный трикотаж 2 класс.",
    chips: ["Диагноз C2", "Детралекс назначен", "УЗИ через 3 мес"],
  },
  {
    when: "3 июня · 10:20",
    title: "Открыт случай",
    note: "Жалобы на тяжесть и отёчность в ногах к концу дня. Направление к флебологу.",
    chips: ["Создан случай"],
  },
];

function TimelineTab() {
  return (
    <div className="surface-card p-4">
      <ol className="relative space-y-5 border-l border-border pl-5">
        {TIMELINE.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-primary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {e.when}
            </div>
            <div className="mt-0.5 text-sm font-semibold text-foreground">{e.title}</div>
            <p className="mt-1 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-foreground/85">
              {e.note}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {e.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                >
                  {c}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const MEDS = [
  {
    name: "Детралекс",
    dose: "1000 мг · 1 раз в сутки · во время еды",
    course: "3 июня — 30 июня 2025",
    by: "Петров А.С.",
    progress: 63,
    days: "19 из 30 дней",
    state: "Активен",
  },
  {
    name: "Аскорутин",
    dose: "1 табл · 3 раза в сутки",
    course: "3 июня — 17 июня 2025",
    by: "Петров А.С.",
    progress: 100,
    days: "14 из 14 дней",
    state: "Завершён",
  },
];

function MedsTab() {
  return (
    <div className="space-y-3">
      {MEDS.map((m) => (
        <div key={m.name} className="surface-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Pill className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.dose}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Курс: {m.course} · Назначил: {m.by}
                </div>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                m.state === "Активен"
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {m.state}
            </span>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Прогресс курса</span>
              <span>{m.days}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full gradient-primary"
                style={{ width: `${m.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TestsTab({ tests }: { tests: string[] }) {
  return (
    <div className="space-y-3">
      {tests.map((t, i) => (
        <div key={i} className="surface-card flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <FlaskRound className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{t}</div>
              <div className="text-[11px] text-muted-foreground">Назначено · ожидает сдачи</div>
            </div>
          </div>
          <button className="rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
            Записаться
          </button>
        </div>
      ))}
    </div>
  );
}

const DOCS = [
  { name: "Направление к хирургу", sub: "PDF · 3 июня 2025" },
  { name: "Выписка — Петров А.С.", sub: "PDF · 8 июня 2025" },
  { name: "Заключение УЗДГ вен", sub: "PDF · 10 июня 2025" },
];

function DocsTab() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {DOCS.map((d) => (
        <button
          key={d.name}
          type="button"
          className="surface-card surface-card-hover flex items-center gap-3 p-4 text-left"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">{d.name}</div>
            <div className="text-[11px] text-muted-foreground">{d.sub}</div>
          </div>
        </button>
      ))}
      <button
        type="button"
        className="surface-card surface-card-hover flex items-center justify-center gap-2 border-2 border-dashed border-border p-4 text-sm font-semibold text-primary"
      >
        <Plus className="h-4 w-4" /> Загрузить документ
      </button>
    </div>
  );
}

function TeamTab({ name, role }: { name: string; role: string }) {
  return (
    <div className="space-y-3">
      <div className="surface-card flex items-center gap-3 p-4">
        <img
          src={doctorPhoto}
          alt={name}
          width={48}
          height={48}
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-2xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{role} · Ведущий специалист</div>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted">
            Чат
          </button>
          <button className="rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
            Записаться
          </button>
        </div>
      </div>
      <div className="surface-card p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-foreground">
          <ClipboardList className="h-4 w-4 text-primary" />
          <span className="font-semibold">Подключить второго специалиста</span>
        </div>
        <p className="mt-1 text-xs">
          Добавьте профильного врача (кардиолог, эндокринолог, ЛОР) для расширенного наблюдения по
          этому случаю.
        </p>
      </div>
    </div>
  );
}
