import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  Brain,
  CheckCircle2,
  ChevronRight,
  Droplets,
  HeartPulse,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import { Tabs } from "@/components/ui/section-tabs";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Lify — Здоровье" },
      { name: "description", content: "Что известно про ваш организм: состояния, риски, прогноз, чекапы." },
    ],
  }),
  component: HealthPage,
});

function HealthPage() {
  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Раздел</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Здоровье</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Что известно про ваш организм на сегодняшний день
        </p>
      </header>

      <Tabs
        tabs={[
          { id: "overview", label: "Обзор", content: <OverviewTab /> },
          { id: "body", label: "Организм", content: <BodyTab /> },
          { id: "states", label: "Состояния", content: <StatesTab /> },
          { id: "risks", label: "Риски", content: <RisksTab /> },
          { id: "forecast", label: "Прогноз", content: <ForecastTab /> },
          { id: "checkups", label: "Чекапы", content: <CheckupsTab /> },
          { id: "changes", label: "Изменения", content: <ChangesTab /> },
        ]}
      />
    </AppShell>
  );
}

function BodyVisualization() {
  return (
    <section className="surface-card relative overflow-hidden p-5">
      <div className="absolute inset-0 opacity-[0.05] gradient-primary" aria-hidden />
      <div className="relative flex items-center gap-5">
        <div className="grid h-32 w-24 place-items-center rounded-2xl bg-card shadow-inner">
          <User className="h-20 w-20 text-primary/70" strokeWidth={1.2} />
        </div>
        <div className="flex-1 space-y-2">
          <SectionTitle title="Визуализация организма" hint="Подсвечены проблемные зоны" />
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="warning">Сосуды</StatusBadge>
            <StatusBadge tone="warning">Сердце</StatusBadge>
            <StatusBadge tone="critical">Гормоны</StatusBadge>
            <StatusBadge tone="success">Нервная система</StatusBadge>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-5">
      <BodyVisualization />

      <section className="surface-card p-5">
        <SectionTitle title="Общее состояние" />
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-success/15 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-semibold">Стабильно</div>
            <div className="text-xs text-muted-foreground">Обновлено сегодня</div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Что требует внимания" />
        <div className="space-y-3">
          <AttentionCard
            tone="critical"
            title="Обнаружен дефицит железа"
            facts={["Ферритин: 18 нг/мл", "Возможна утомляемость, выпадение волос"]}
          />
          <AttentionCard
            tone="warning"
            title="Повышено артериальное давление"
            facts={["Последние измерения: 145/95", "Требует наблюдения"]}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-5">
          <SectionTitle title="Выводы специалистов" />
          <ul className="space-y-2.5 text-sm">
            <ListLine tone="warning">Сосудистая система требует внимания</ListLine>
            <ListLine tone="success">Дефицитов не обнаружено</ListLine>
            <ListLine tone="success">Риск диабета низкий</ListLine>
          </ul>
        </div>
        <div className="surface-card p-5">
          <SectionTitle title="Выводы ИИ" />
          <ul className="space-y-2.5 text-sm">
            <ListLine icon={Sparkles} tone="primary">
              Уровень активности выше среднего за месяц
            </ListLine>
            <ListLine icon={Sparkles} tone="accent">
              Сон стабилизировался — 7.2 ч
            </ListLine>
          </ul>
        </div>
      </section>
    </div>
  );
}

const SYSTEMS = [
  { name: "Сердце и сосуды", icon: HeartPulse, tone: "warning" as const, note: "Гипертензия" },
  { name: "Гормоны", icon: Droplets, tone: "critical" as const, note: "Контроль" },
  { name: "ЖКТ", icon: Activity, tone: "success" as const, note: "Норма" },
  { name: "Иммунитет", icon: Shield, tone: "success" as const, note: "Норма" },
  { name: "Нервная система", icon: Brain, tone: "success" as const, note: "Норма" },
  { name: "Кожа", icon: User, tone: "warning" as const, note: "Акне" },
  { name: "ОДА", icon: Activity, tone: "success" as const, note: "Норма" },
  { name: "Мочеполовая", icon: User, tone: "success" as const, note: "Норма" },
];

function BodyTab() {
  return (
    <div className="space-y-5">
      <BodyVisualization />
      <section>
        <SectionTitle title="Системы организма" hint="Нажмите, чтобы открыть подробности" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SYSTEMS.map((s) => (
            <button
              key={s.name}
              type="button"
              className="surface-card surface-card-hover flex flex-col items-start gap-3 p-4 text-left"
            >
              <div className="flex w-full items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className={`status-dot ${
                  s.tone === "success" ? "bg-success" : s.tone === "warning" ? "bg-warning" : "bg-critical"
                }`} />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.note}</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

const STATES = [
  { name: "Варикоз", status: "Активное наблюдение", tone: "primary" as const },
  { name: "Артериальная гипертензия", status: "Лечение", tone: "warning" as const },
  { name: "Дефицит железа", status: "Контроль", tone: "accent" as const },
  { name: "Акне", status: "Наблюдение", tone: "default" as const },
  { name: "Инсулинорезистентность", status: "Диагностика", tone: "critical" as const },
];

function StatesTab() {
  return (
    <div className="space-y-5">
      <BodyVisualization />
      <section className="space-y-2">
        <SectionTitle title="Список состояний" />
        {STATES.map((s) => (
          <button
            key={s.name}
            type="button"
            className="surface-card surface-card-hover flex w-full items-center justify-between gap-3 p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{s.name}</div>
                <StatusBadge tone={s.tone}>{s.status}</StatusBadge>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}
      </section>
    </div>
  );
}

function RisksTab() {
  const risks = [
    { name: "Диабет", level: "Низкий риск", tone: "success" as const },
    { name: "Гипертония", level: "Средний риск", tone: "warning" as const },
    { name: "Атеросклероз", level: "Высокий риск", tone: "critical" as const },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {risks.map((r) => (
        <div key={r.name} className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <AlertCircle className="h-5 w-5" />
            </div>
            <StatusBadge tone={r.tone}>{r.level}</StatusBadge>
          </div>
          <div className="mt-4 text-base font-semibold">{r.name}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Оценка по совокупности факторов: образ жизни, анализы, история.
          </p>
        </div>
      ))}
    </div>
  );
}

function ForecastTab() {
  const horizons = ["6 месяцев", "1 год", "5 лет"];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {horizons.map((h) => (
        <div key={h} className="surface-card p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Через</div>
          <div className="mt-1 text-2xl font-bold text-gradient-primary">{h}</div>
          <p className="mt-3 text-xs text-muted-foreground">
            Прогноз состояния организма с учётом текущих факторов и динамики показателей.
          </p>
        </div>
      ))}
    </div>
  );
}

function CheckupsTab() {
  const items = [
    "Общий анализ крови",
    "Биохимия крови",
    "Глюкоза",
    "Липидограмма",
    "Витамин D",
    "Осмотр офтальмолога",
  ];
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={it} className="surface-card flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/40 text-accent-foreground">
              {i + 1}
            </div>
            <div className="text-sm font-medium">{it}</div>
          </div>
          <StatusBadge tone={i < 2 ? "success" : "default"}>
            {i < 2 ? "Выполнено" : "Запланировать"}
          </StatusBadge>
        </div>
      ))}
    </div>
  );
}

function ChangesTab() {
  const changes = [
    { name: "Ферритин", from: "18", to: "32 нг/мл", trend: "up", note: "Улучшение", tone: "success" as const },
    { name: "АД", from: "150/95", to: "138/88", trend: "down", note: "Улучшение", tone: "success" as const },
    { name: "Вес", from: "92", to: "87 кг", trend: "down", note: "Снижение", tone: "primary" as const },
    { name: "ЛПНП", from: "3.9", to: "4.8", trend: "up", note: "Повышение", tone: "warning" as const },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {changes.map((c) => (
        <div key={c.name} className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{c.name}</div>
            <StatusBadge tone={c.tone}>
              {c.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {c.note}
            </StatusBadge>
          </div>
          <div className="mt-3 flex items-baseline gap-2 text-lg font-bold">
            <span className="text-muted-foreground">{c.from}</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-gradient-primary">{c.to}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AttentionCard({
  tone,
  title,
  facts,
}: {
  tone: "critical" | "warning";
  title: string;
  facts: string[];
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-start gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
            tone === "critical" ? "bg-critical/15 text-critical" : "bg-warning/20 text-warning-foreground"
          }`}
        >
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            <StatusBadge tone={tone}>{tone === "critical" ? "Внимание" : "Наблюдение"}</StatusBadge>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {facts.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
          <button className="mt-3 text-xs font-semibold text-primary hover:underline">
            Открыть →
          </button>
        </div>
      </div>
    </div>
  );
}

function ListLine({
  children,
  tone,
  icon: Icon = CheckCircle2,
}: {
  children: React.ReactNode;
  tone: "success" | "warning" | "primary" | "accent";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const tones = {
    success: "text-success",
    warning: "text-warning-foreground",
    primary: "text-primary",
    accent: "text-accent-foreground",
  } as const;
  return (
    <li className="flex items-start gap-2">
      <Icon className={`mt-0.5 h-4 w-4 ${tones[tone]}`} />
      <span className="text-foreground">{children}</span>
    </li>
  );
}
