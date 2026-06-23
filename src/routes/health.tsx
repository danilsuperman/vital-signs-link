import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Eye,
  FileText,
  HeartPulse,
  Microscope,
  Plus,
  Share2,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Wind,
  Bone,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import { Tabs } from "@/components/ui/section-tabs";
import { ShareDialog } from "@/components/share-dialog";
import type { ShareScope } from "@/lib/share-links-store";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Lify — Здоровье" },
      { name: "description", content: "Что известно про ваш организм: состояния, риски, прогноз, динамика, история." },
    ],
  }),
  component: HealthPage,
});

function HealthPage() {
  const [share, setShare] = useState<{ scope: ShareScope; context?: string } | null>(null);

  return (
    <AppShell>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Раздел</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Здоровье</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Что известно про ваш организм, что происходит сейчас и что делать дальше
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShare({ scope: "labs", context: "Анализы и обследования" })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <Share2 className="h-4 w-4" /> Поделиться анализами
          </button>
          <button
            type="button"
            onClick={() => setShare({ scope: "full", context: "Вся медкарта" })}
            className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            <Share2 className="h-4 w-4" /> Поделиться медкартой
          </button>
        </div>
      </header>

      <Tabs
        tabs={[
          { id: "overview", label: "Обзор", content: <OverviewTab /> },
          { id: "body", label: "Мой организм", content: <BodyTab /> },
          { id: "strategy", label: "Стратегия", content: <StrategyTab /> },
          { id: "dynamics", label: "Динамика", content: <DynamicsTab /> },
          { id: "history", label: "История", content: <HistoryTab /> },
        ]}
      />

      <ShareDialog
        open={share !== null}
        onOpenChange={(o) => !o && setShare(null)}
        initialScope={share?.scope ?? "full"}
        context={share?.context}
      />
    </AppShell>
  );
}

/* ───────── shared ───────── */

function BodyVisualization({ compact = false }: { compact?: boolean }) {
  return (
    <section className="surface-card relative overflow-hidden p-5">
      <div className="absolute inset-0 opacity-[0.05] gradient-primary" aria-hidden />
      <div className="relative flex items-center gap-5">
        <div className={`grid shrink-0 place-items-center rounded-2xl bg-card shadow-inner ${compact ? "h-24 w-20" : "h-32 w-24"}`}>
          <User className={compact ? "h-14 w-14 text-primary/70" : "h-20 w-20 text-primary/70"} strokeWidth={1.2} />
        </div>
        <div className="flex-1 space-y-2">
          <SectionTitle title="Визуализация организма" hint="Нажмите систему, чтобы открыть подробности" />
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

/* ───────── Обзор ───────── */

function OverviewTab() {
  return (
    <div className="space-y-5">
      {/* Главное */}
      <section className="surface-card overflow-hidden">
        <div className="relative p-5">
          <div className="absolute inset-0 gradient-primary opacity-[0.06]" aria-hidden />
          <div className="relative space-y-3">
            <SectionTitle title="Что известно на сегодняшний день" hint="Последнее обновление: сегодня в 11:24" />
            <div className="grid grid-cols-3 gap-3">
              <SummaryStat value="3" label="Состояния под наблюдением" tone="warning" />
              <SummaryStat value="0" label="Критических изменений" tone="success" />
              <SummaryStat value="4" label="Активных назначений" tone="primary" />
            </div>
          </div>
        </div>
      </section>

      <BodyVisualization />

      {/* Требует внимания */}
      <section>
        <SectionTitle title="Требует внимания" />
        <div className="space-y-3">
          <AttentionCard
            tone="critical"
            title="Дефицит железа"
            meaning="Запасы железа снижены. Это может сопровождаться усталостью, снижением выносливости, выпадением волос."
            facts={["Последний ферритин: 18 нг/мл"]}
            actions={["Повторить ферритин", "Проверить ОЖСС", "Консультация терапевта"]}
          />
          <AttentionCard
            tone="warning"
            title="Артериальное давление выше рекомендуемых значений"
            meaning="При длительном сохранении может увеличивать нагрузку на сердце и сосуды."
            facts={["Последнее измерение: 145/95"]}
            actions={["Контроль давления", "Консультация кардиолога"]}
          />
        </div>
      </section>

      {/* Что делать сейчас */}
      <section>
        <SectionTitle title="Что делать сейчас" />
        <div className="space-y-3">
          <ActionGroup tone="critical" title="Срочно" items={["Повторить ферритин"]} />
          <ActionGroup tone="warning" title="В течение месяца" items={["Пройти УЗИ вен"]} />
          <ActionGroup tone="primary" title="Планово" items={["Ежегодный контроль здоровья"]} />
        </div>
      </section>

      {/* Обзор организма */}
      <section className="surface-card p-5">
        <SectionTitle title="Обзор организма" hint="Краткое резюме цифрового двойника" />
        <ul className="space-y-2.5 text-sm text-foreground/85">
          <li>• Сердечно-сосудистая система требует наблюдения в связи с варикозом и повышенным артериальным давлением.</li>
          <li>• Данных по гормональной системе недостаточно для полноценной оценки.</li>
          <li>• Признаков выраженных нарушений со стороны ЖКТ не обнаружено.</li>
          <li>• Рекомендуется обновить данные по липидному профилю и ЭКГ.</li>
        </ul>
      </section>

      {/* Риски */}
      <section>
        <SectionTitle title="Риски" hint="Только реальные факторы риска" />
        <div className="grid gap-3 sm:grid-cols-2">
          <RiskCard tone="critical" text="Повышенное давление более 3 дней" />
          <RiskCard tone="warning" text="Избыточная масса тела" />
          <RiskCard tone="critical" text="Критический дефицит витамина D" />
          <RiskCard tone="warning" text="Варикоз 30 дней без лечения" />
        </div>
      </section>

      {/* Прогноз */}
      <section>
        <SectionTitle title="Прогноз" hint="Только для существующих состояний" />
        <div className="grid gap-3 sm:grid-cols-2">
          <ForecastCard title="Варикоз" text="Без наблюдения заболевание может прогрессировать." tone="warning" />
          <ForecastCard title="Гипертония" text="Требуется регулярный контроль давления." tone="warning" />
        </div>
      </section>
    </div>
  );
}

function SummaryStat({ value, label, tone }: { value: string; label: string; tone: "success" | "warning" | "primary" }) {
  const map = {
    success: "text-success",
    warning: "text-warning-foreground",
    primary: "text-primary",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className={`text-2xl font-bold ${map[tone]}`}>{value}</div>
      <div className="mt-1 text-[11px] leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}

function ActionGroup({ tone, title, items }: { tone: "critical" | "warning" | "primary"; title: string; items: string[] }) {
  return (
    <div className="surface-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <StatusBadge tone={tone}>{title}</StatusBadge>
      </div>
      <ul className="space-y-1.5 text-sm text-foreground/85">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskCard({ tone, text }: { tone: "critical" | "warning"; text: string }) {
  return (
    <div className="surface-card flex items-start gap-3 p-4">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
        tone === "critical" ? "bg-critical/15 text-critical" : "bg-warning/20 text-warning-foreground"
      }`}>
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="text-sm font-medium">{text}</div>
    </div>
  );
}

function ForecastCard({ title, text, tone }: { title: string; text: string; tone: "warning" | "critical" }) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">{title}</div>
        <StatusBadge tone={tone}>Прогноз</StatusBadge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

/* ───────── Мой организм ───────── */

const SYSTEMS = [
  { id: "heart", name: "Сердце и сосуды", icon: HeartPulse, tone: "warning" as const, states: 2, risks: 2, data: "Информация достаточна", note: "Контроль давления" },
  { id: "hormones", name: "Гормоны", icon: Droplets, tone: "critical" as const, states: 1, risks: 3, data: "Информация частична", note: "Сдать ТТГ, Т4" },
  { id: "blood", name: "Кроветворение", icon: Activity, tone: "warning" as const, states: 1, risks: 1, data: "Информация частична", note: "Контроль ферритина" },
  { id: "gi", name: "ЖКТ", icon: Activity, tone: "success" as const, states: 0, risks: 1, data: "Информации недостаточно", note: "Биохимия, УЗИ ОБП" },
  { id: "immune", name: "Иммунитет", icon: Shield, tone: "default" as const, states: 0, risks: 0, data: "Информация отсутствует", note: "Базовая иммунограмма" },
  { id: "nervous", name: "Нервная система", icon: Brain, tone: "success" as const, states: 0, risks: 0, data: "Информация достаточна", note: "Норма" },
  { id: "skin", name: "Кожа", icon: User, tone: "warning" as const, states: 1, risks: 1, data: "Информация частична", note: "Консультация дерматолога" },
  { id: "bones", name: "Опорно-двигательная", icon: Bone, tone: "success" as const, states: 0, risks: 0, data: "Информация достаточна", note: "Норма" },
  { id: "urinary", name: "Мочеполовая", icon: User, tone: "success" as const, states: 0, risks: 0, data: "Информация достаточна", note: "Норма" },
  { id: "vision", name: "Органы зрения", icon: Eye, tone: "default" as const, states: 0, risks: 0, data: "Информация отсутствует", note: "Запланировать осмотр" },
  { id: "lungs", name: "Органы дыхания", icon: Wind, tone: "success" as const, states: 0, risks: 0, data: "Информация достаточна", note: "Норма" },
];

function BodyTab() {
  return (
    <div className="space-y-5">
      <BodyVisualization />

      {/* Системы */}
      <section>
        <SectionTitle title="Системы организма" hint="Нажмите, чтобы открыть подробности" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((s) => (
            <SystemCard key={s.name} s={s} />
          ))}
        </div>
      </section>

      {/* Навигатор */}
      <section>
        <SectionTitle title="Навигатор" hint="Насколько хорошо система понимает ваш организм" />
        <div className="space-y-3">
          <NavigatorRow
            name="Сердечно-сосудистая система"
            status="Информация достаточна"
            tone="success"
            why="Анализы и УЗИ актуальны."
            need={["Контроль через 6 мес"]}
          />
          <NavigatorRow
            name="Щитовидная железа"
            status="Информация частична"
            tone="warning"
            why="Последние анализы выполнены более 2 лет назад."
            need={["ТТГ", "Т4 свободный", "УЗИ щитовидной"]}
            value="Позволит исключить субклинические нарушения."
          />
          <NavigatorRow
            name="ЖКТ"
            status="Информации недостаточно"
            tone="critical"
            why="Нет данных за последние 3 года."
            need={["ОАК", "Биохимия", "УЗИ органов брюшной полости"]}
            value="Позволит уточнить состояние и исключить скрытые нарушения."
          />
        </div>
      </section>

      {/* Что беспокоит */}
      <section>
        <SectionTitle title="Что беспокоит сейчас" />
        <div className="space-y-2">
          <SymptomRow text="Тяжесть в ногах" since="с апреля 2027" />
          <SymptomRow text="Отёки к вечеру" since="с мая 2027" />
          <button className="surface-card surface-card-hover flex w-full items-center justify-center gap-2 p-3 text-sm font-medium text-primary">
            <Plus className="h-4 w-4" /> Добавить симптом
          </button>
        </div>
      </section>

      {/* Требуют расшифровки */}
      <section>
        <SectionTitle title="Требуют расшифровки" hint="Новые данные, ждут анализа" />
        <div className="space-y-2">
          {["Общий анализ крови", "МРТ коленного сустава", "УЗИ щитовидной железы"].map((t) => (
            <div key={t} className="surface-card flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/40 text-accent-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="text-sm font-medium">{t}</div>
              </div>
              <button className="rounded-xl gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
                Расшифровать
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SystemCard({ s }: { s: typeof SYSTEMS[number] }) {
  const dotColor =
    s.tone === "success" ? "bg-success" : s.tone === "warning" ? "bg-warning" : s.tone === "critical" ? "bg-critical" : "bg-muted-foreground";
  return (
    <button
      type="button"
      className="surface-card surface-card-hover flex flex-col items-start gap-3 p-4 text-left"
    >
      <div className="flex w-full items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <s.icon className="h-5 w-5" />
        </div>
        <span className={`status-dot ${dotColor}`} />
      </div>
      <div className="w-full">
        <div className="text-sm font-semibold text-foreground">{s.name}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {s.states} состояний · {s.risks} факторов риска
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">{s.data}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-1 text-[11px] font-medium text-primary">{s.note}</div>
      </div>
    </button>
  );
}

function NavigatorRow({
  name,
  status,
  tone,
  why,
  need,
  value,
}: {
  name: string;
  status: string;
  tone: "success" | "warning" | "critical";
  why: string;
  need: string[];
  value?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="surface-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-muted/40"
      >
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="mt-1">
            <StatusBadge tone={tone}>{status}</StatusBadge>
          </div>
        </div>
        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="space-y-3 border-t border-border bg-muted/30 p-4 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Почему</div>
            <div className="mt-1 text-foreground/85">{why}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Что необходимо</div>
            <ul className="mt-1 space-y-1 text-foreground/85">
              {need.map((n) => <li key={n}>• {n}</li>)}
            </ul>
          </div>
          {value && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Что это даст</div>
              <div className="mt-1 text-foreground/85">{value}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SymptomRow({ text, since }: { text: string; since: string }) {
  return (
    <div className="surface-card flex items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-warning/20 text-warning-foreground">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold">{text}</div>
          <div className="text-[11px] text-muted-foreground">{since}</div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

/* ───────── Стратегия ───────── */

const CONDITIONS = [
  {
    name: "Варикоз",
    known: "Диагноз подтвержден УЗИ вен.",
    basis: ["УЗИ вен", "Заключение флеболога", "Симптомы пользователя"],
    now: ["Наблюдение", "Компрессионная терапия"],
    todo: ["Контрольное УЗИ", "Повторная консультация"],
    forecast: "Без лечения заболевание может прогрессировать.",
  },
  {
    name: "Артериальная гипертензия",
    known: "Зафиксированы устойчивые эпизоды повышенного АД.",
    basis: ["Серия измерений", "Консультация терапевта"],
    now: ["Контроль АД", "Изменение образа жизни"],
    todo: ["Консультация кардиолога", "Биохимия", "ЭКГ"],
    forecast: "Требуется регулярный контроль давления.",
  },
  {
    name: "Дефицит железа",
    known: "Ферритин ниже нормы.",
    basis: ["Ферритин 18 нг/мл"],
    now: ["Курс препаратов железа"],
    todo: ["Повтор ферритина", "ОЖСС"],
    forecast: "При коррекции прогноз благоприятный.",
  },
];

function StrategyTab() {
  return (
    <div className="space-y-5">
      <section>
        <SectionTitle title="Что обнаружено" hint="Список ваших состояний" />
        <div className="space-y-3">
          {CONDITIONS.map((c) => <ConditionCard key={c.name} c={c} />)}
        </div>
      </section>

      <section>
        <SectionTitle title="Персональные решения" hint="Что делать дальше" />
        <div className="space-y-3">
          <ActionGroup tone="critical" title="Срочно" items={["Повторить ферритин"]} />
          <ActionGroup tone="warning" title="В течение месяца" items={["Пройти УЗИ вен"]} />
          <ActionGroup tone="primary" title="26.07.2026" items={["Ежегодный чекап"]} />
        </div>
      </section>

      <section>
        <SectionTitle title="Напоминания" />
        <div className="grid gap-3 sm:grid-cols-3">
          {["Контроль давления", "Повторный анализ", "Приём препарата"].map((t) => (
            <div key={t} className="surface-card flex items-center gap-3 p-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">{t}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Рекомендуемые обследования" hint="На основании возраста, пола, заболеваний и семейного анамнеза" />
        <div className="grid gap-2 sm:grid-cols-2">
          {["Липидограмма", "ЭКГ", "УЗИ щитовидной", "Витамин D", "Биохимия", "Глюкоза натощак"].map((t) => (
            <div key={t} className="surface-card flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-4 w-4 text-primary" />
                <div className="text-sm">{t}</div>
              </div>
              <button className="text-xs font-semibold text-primary hover:underline">Записаться</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ConditionCard({ c }: { c: typeof CONDITIONS[number] }) {
  return (
    <article className="surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold">{c.name}</div>
          <div className="mt-1 text-sm text-muted-foreground">{c.known}</div>
        </div>
        <StatusBadge tone="primary">Состояние</StatusBadge>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Block title="На чём основан вывод" items={c.basis} />
        <Block title="Что делается сейчас" items={c.now} />
        <Block title="Что нужно сделать" items={c.todo} />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Прогноз</div>
          <p className="mt-1.5 text-sm text-foreground/85">{c.forecast}</p>
        </div>
      </div>
    </article>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-1.5 space-y-1 text-sm text-foreground/85">
        {items.map((i) => <li key={i}>• {i}</li>)}
      </ul>
    </div>
  );
}

/* ───────── Динамика ───────── */

function DynamicsTab() {
  const changes = [
    { name: "Ферритин", from: "18", to: "32 нг/мл", trend: "up", note: "Улучшение", tone: "success" as const },
    { name: "ЛПНП", from: "3.8", to: "4.9 ммоль/л", trend: "up", note: "Повышение", tone: "warning" as const },
    { name: "Вес", from: "95", to: "89 кг", trend: "down", note: "Снижение", tone: "primary" as const },
    { name: "АД", from: "150/95", to: "138/88", trend: "down", note: "Улучшение", tone: "success" as const },
  ];
  return (
    <div className="space-y-5">
      <section>
        <SectionTitle title="Динамика показателей" />
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
      </section>

      <section>
        <SectionTitle title="Напоминания по контролю" />
        <div className="space-y-2">
          {[
            { name: "Ферритин", when: "через 2 недели" },
            { name: "Липидограмма", when: "через 3 месяца" },
          ].map((r) => (
            <div key={r.name} className="surface-card flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.when}</div>
                </div>
              </div>
              <button className="text-xs font-semibold text-primary hover:underline">Записаться</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ───────── История ───────── */

const TIMELINE = [
  { date: "Март 2026", text: "Диагностирован варикоз", tone: "warning" as const },
  { date: "Апрель 2026", text: "Выполнено УЗИ вен", tone: "primary" as const },
  { date: "Май 2026", text: "Начата терапия", tone: "primary" as const },
  { date: "Июнь 2026", text: "Ферритин: 18 → 32", tone: "success" as const },
  { date: "Июль 2026", text: "Появился симптом: тяжесть в ногах", tone: "warning" as const },
  { date: "Август 2026", text: "Добавлен новый диагноз: артериальная гипертензия", tone: "critical" as const },
];

function HistoryTab() {
  return (
    <div className="space-y-5">
      <section>
        <SectionTitle title="Лента событий" hint="Полная хроника здоровья" />
        <div className="surface-card p-5">
          <ol className="relative space-y-5 border-l-2 border-border pl-5">
            {TIMELINE.map((e) => (
              <li key={e.date + e.text} className="relative">
                <span className={`absolute -left-[27px] top-1.5 grid h-4 w-4 place-items-center rounded-full ring-4 ring-card ${
                  e.tone === "success" ? "bg-success" : e.tone === "warning" ? "bg-warning" : e.tone === "critical" ? "bg-critical" : "bg-primary"
                }`} />
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{e.date}</div>
                <div className="mt-0.5 text-sm font-medium text-foreground">{e.text}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-5">
          <SectionTitle title="Прошлые состояния" />
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between"><span>Пневмония</span><StatusBadge tone="default">Закрыто</StatusBadge></li>
            <li className="flex items-center justify-between"><span>COVID-19</span><StatusBadge tone="default">Закрыто</StatusBadge></li>
          </ul>
        </div>
        <div className="surface-card p-5">
          <SectionTitle title="Симптомы" hint="С привязкой к датам и состояниям" />
          <ul className="space-y-2 text-sm">
            {[
              ["Тяжесть в ногах", "с апреля 2026"],
              ["Одышка", "март 2026"],
              ["Головная боль", "июль 2025"],
              ["Изжога", "май 2024"],
            ].map(([s, d]) => (
              <li key={s} className="flex items-center justify-between">
                <span>{s}</span>
                <span className="text-[11px] text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ───────── shared atom ───────── */

function AttentionCard({
  tone,
  title,
  meaning,
  facts,
  actions,
}: {
  tone: "critical" | "warning";
  title: string;
  meaning: string;
  facts: string[];
  actions: string[];
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
            {facts.map((f) => <li key={f}>• {f}</li>)}
          </ul>
          <div className="mt-3 rounded-xl bg-muted/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Что это значит</div>
            <p className="mt-1 text-sm text-foreground/85">{meaning}</p>
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Что делать сейчас</div>
            <ul className="mt-1.5 space-y-1 text-sm text-foreground/85">
              {actions.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> {a}
                </li>
              ))}
            </ul>
          </div>
          <button className="mt-3 text-xs font-semibold text-primary hover:underline">Открыть случай →</button>
        </div>
      </div>
    </div>
  );
}

