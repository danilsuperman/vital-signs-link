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
  const quick = [
    { id: "heart", label: "Сосуды", tone: "warning" as const },
    { id: "heart", label: "Сердце", tone: "warning" as const },
    { id: "hormones", label: "Гормоны", tone: "critical" as const },
    { id: "nervous", label: "Нервная система", tone: "success" as const },
  ];
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
            {quick.map((q) => (
              <Link
                key={q.label}
                to="/health/system/$systemId"
                params={{ systemId: q.id }}
              >
                <StatusBadge tone={q.tone}>{q.label}</StatusBadge>
              </Link>
            ))}
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
    <Link
      to="/health/system/$systemId"
      params={{ systemId: s.id }}
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
    </Link>
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

/* ───────── Стратегия (профессиональная) ───────── */

type ProCondition = {
  name: string;
  icd: string;
  severity: "mild" | "moderate" | "severe";
  evidence: "high" | "moderate" | "low";
  known: string;
  diagnosis: { method: string; result: string }[];
  markers: { name: string; value: string; target: string; tone: "success" | "warning" | "critical" }[];
  current: { kind: "Препарат" | "Терапия" | "Образ жизни"; text: string }[];
  plan: { what: string; when: string; urgency: "now" | "soon" | "plan" }[];
  goals: { metric: string; target: string; horizon: string }[];
  guidelines: { name: string; ref: string }[];
  forecast: string;
};

const PRO_CONDITIONS: ProCondition[] = [
  {
    name: "Варикозная болезнь нижних конечностей",
    icd: "I83.9",
    severity: "moderate",
    evidence: "high",
    known: "Диагноз подтверждён дуплексным сканированием вен (CEAP C2).",
    diagnosis: [
      { method: "УЗДС вен н/к", result: "Несостоятельность БПВ справа, рефлюкс 1.4 с" },
      { method: "Осмотр флеболога", result: "CEAP C2, EP, AS, PR" },
    ],
    markers: [
      { name: "Окружность голени (Δ)", value: "+1.2 см", target: "<0.5 см", tone: "warning" },
      { name: "D-димер", value: "0.3 мкг/мл", target: "<0.5", tone: "success" },
    ],
    current: [
      { kind: "Терапия", text: "Компрессионный трикотаж 2 класс, ежедневно" },
      { kind: "Препарат", text: "Диосмин 600 мг × 1 раз/сут, 2 мес" },
      { kind: "Образ жизни", text: "Динамические упражнения, контроль массы тела" },
    ],
    plan: [
      { what: "Контрольное УЗДС вен", when: "через 3 мес", urgency: "soon" },
      { what: "Повторная консультация флеболога", when: "через 3 мес", urgency: "soon" },
      { what: "Рассмотреть ЭВЛК при прогрессии", when: "по показаниям", urgency: "plan" },
    ],
    goals: [
      { metric: "Прогрессия CEAP", target: "Без перехода в C3+", horizon: "12 мес" },
      { metric: "Симптомы (VCSS)", target: "≤ 4 балла", horizon: "6 мес" },
    ],
    guidelines: [
      { name: "Клин. рекомендации МЗ РФ «Варикозная болезнь»", ref: "2021" },
      { name: "ESVS Guidelines", ref: "2022" },
    ],
    forecast: "При соблюдении плана и компрессии — стабилизация. Без терапии — риск прогрессии до C3–C4 в течение 2–3 лет.",
  },
  {
    name: "Артериальная гипертензия I стадии",
    icd: "I10",
    severity: "mild",
    evidence: "high",
    known: "Устойчивое повышение АД >130/85 при серии измерений (3 визита, СМАД).",
    diagnosis: [
      { method: "СМАД", result: "Среднесуточное АД 142/88, ночное снижение недостаточное" },
      { method: "ЭКГ", result: "Ритм синусовый, ЧСС 72, без признаков ГЛЖ" },
    ],
    markers: [
      { name: "АД (среднее)", value: "138/88", target: "<130/80", tone: "warning" },
      { name: "ЛПНП", value: "4.9 ммоль/л", target: "<3.0", tone: "critical" },
      { name: "Глюкоза натощак", value: "5.4 ммоль/л", target: "<6.1", tone: "success" },
      { name: "SCORE2 (10-летний риск)", value: "4%", target: "<5%", tone: "success" },
    ],
    current: [
      { kind: "Образ жизни", text: "DASH-диета, ограничение соли <5 г/сут" },
      { kind: "Терапия", text: "Аэробная нагрузка 150 мин/нед" },
    ],
    plan: [
      { what: "Консультация кардиолога", when: "в течение 2 недель", urgency: "now" },
      { what: "Липидограмма расширенная, креатинин, калий", when: "в течение месяца", urgency: "soon" },
      { what: "Холтер-ЭКГ 24 ч", when: "при сердцебиении", urgency: "plan" },
      { what: "Рассмотреть стартовую терапию (иАПФ/БРА)", when: "по решению кардиолога", urgency: "soon" },
    ],
    goals: [
      { metric: "Среднее АД", target: "<130/80", horizon: "3 мес" },
      { metric: "ЛПНП", target: "<3.0 ммоль/л", horizon: "6 мес" },
    ],
    guidelines: [
      { name: "ESC/ESH Guidelines for Hypertension", ref: "2024" },
      { name: "Клин. рекомендации МЗ РФ «Артериальная гипертензия»", ref: "2024" },
    ],
    forecast: "При коррекции образа жизни и достижении целевого АД — низкий 10-летний кардиоваскулярный риск.",
  },
  {
    name: "Латентный дефицит железа",
    icd: "E61.1",
    severity: "mild",
    evidence: "high",
    known: "Снижение ферритина без анемии. На фоне терапии — положительная динамика.",
    diagnosis: [
      { method: "Ферритин", result: "32 нг/мл (исходно 18)" },
      { method: "ОАК", result: "Hb 138 г/л, MCV 86 фл" },
    ],
    markers: [
      { name: "Ферритин", value: "32 нг/мл", target: ">50", tone: "warning" },
      { name: "Гемоглобин", value: "138 г/л", target: "130–170", tone: "success" },
      { name: "Трансферрин", value: "—", target: "2.0–3.6", tone: "warning" },
    ],
    current: [
      { kind: "Препарат", text: "Железа сульфат 100 мг × 1 раз/сут + витамин C 200 мг" },
      { kind: "Образ жизни", text: "Увеличение красного мяса, бобовых; разнесение с кофе/чаем" },
    ],
    plan: [
      { what: "Повторить ферритин + ОЖСС", when: "через 2 недели", urgency: "now" },
      { what: "Курс препаратов железа", when: "не менее 3 мес после нормализации", urgency: "soon" },
    ],
    goals: [{ metric: "Ферритин", target: ">50 нг/мл", horizon: "2 мес" }],
    guidelines: [
      { name: "WHO Iron Deficiency Guideline", ref: "2023" },
      { name: "BSH Guidelines on iron deficiency", ref: "2021" },
    ],
    forecast: "При полном курсе терапии — восстановление запасов железа без рецидива в течение 12 мес.",
  },
];

function StrategyTab() {
  return (
    <div className="space-y-5">
      <section className="surface-card overflow-hidden">
        <div className="relative p-5">
          <div className="absolute inset-0 gradient-primary opacity-[0.06]" aria-hidden />
          <div className="relative flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <SectionTitle
                title="Клиническая стратегия"
                hint="Состояния, диагностика, цели терапии и протоколы по клин. рекомендациям"
              />
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-card p-2.5">
                  <div className="text-xl font-bold text-foreground">{PRO_CONDITIONS.length}</div>
                  <div className="text-[11px] text-muted-foreground">Активных диагнозов</div>
                </div>
                <div className="rounded-xl bg-card p-2.5">
                  <div className="text-xl font-bold text-warning-foreground">
                    {PRO_CONDITIONS.flatMap((c) => c.plan).filter((p) => p.urgency === "now").length}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Срочных задач</div>
                </div>
                <div className="rounded-xl bg-card p-2.5">
                  <div className="text-xl font-bold text-success">{PRO_CONDITIONS.flatMap((c) => c.goals).length}</div>
                  <div className="text-[11px] text-muted-foreground">Целевых показателей</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Состояния и протоколы" />
        <div className="space-y-3">
          {PRO_CONDITIONS.map((c) => <ProConditionCard key={c.name} c={c} />)}
        </div>
      </section>

      <section>
        <SectionTitle title="Рекомендуемые обследования" hint="На основании возраста, пола, диагнозов и семейного анамнеза" />
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Липидограмма расширенная",
            "ЭКГ + Холтер 24ч",
            "УЗИ щитовидной + ТТГ/Т4",
            "Витамин D (25-OH)",
            "Биохимия (АЛТ, АСТ, креатинин, глюкоза)",
            "HbA1c",
          ].map((t) => (
            <div key={t} className="surface-card flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-3">
                <Microscope className="h-4 w-4 text-primary" />
                <div className="text-sm">{t}</div>
              </div>
              <button className="text-xs font-semibold text-primary hover:underline">Записаться</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Напоминания по контролю" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "Контроль АД", when: "ежедневно утром и вечером" },
            { name: "Повторный ферритин", when: "через 2 недели" },
            { name: "Приём железа", when: "ежедневно × 3 мес" },
          ].map((r) => (
            <div key={r.name} className="surface-card flex items-center gap-3 p-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-[11px] text-muted-foreground">{r.when}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProConditionCard({ c }: { c: ProCondition }) {
  const sevMap = {
    mild: { label: "Лёгкая", tone: "success" as const },
    moderate: { label: "Средняя", tone: "warning" as const },
    severe: { label: "Тяжёлая", tone: "critical" as const },
  };
  const evMap = {
    high: "Высокий",
    moderate: "Средний",
    low: "Низкий",
  };
  return (
    <article className="surface-card p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{c.name}</h3>
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono font-semibold text-muted-foreground">
              МКБ-10: {c.icd}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{c.known}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge tone={sevMap[c.severity].tone}>Степень: {sevMap[c.severity].label}</StatusBadge>
          <StatusBadge tone="primary">Доказательность: {evMap[c.evidence]}</StatusBadge>
        </div>
      </header>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Диагностика</div>
          <ul className="mt-1.5 space-y-1.5 text-sm">
            {c.diagnosis.map((d) => (
              <li key={d.method} className="rounded-lg bg-muted/40 p-2">
                <div className="text-[11px] font-semibold text-muted-foreground">{d.method}</div>
                <div className="text-foreground/90">{d.result}</div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Маркеры</div>
          <ul className="mt-1.5 space-y-1.5 text-sm">
            {c.markers.map((m) => (
              <li key={m.name} className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 p-2">
                <span className="text-foreground/90">{m.name}</span>
                <span className="flex items-center gap-2">
                  <span
                    className={`font-semibold ${
                      m.tone === "critical"
                        ? "text-critical"
                        : m.tone === "warning"
                          ? "text-warning-foreground"
                          : "text-success"
                    }`}
                  >
                    {m.value}
                  </span>
                  <span className="text-[11px] text-muted-foreground">цель {m.target}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Текущая терапия</div>
          <ul className="mt-1.5 space-y-1 text-sm">
            {c.current.map((t) => (
              <li key={t.text} className="flex items-start gap-2">
                <span className="mt-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {t.kind}
                </span>
                <span className="text-foreground/90">{t.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">План действий</div>
          <ul className="mt-1.5 space-y-1.5 text-sm">
            {c.plan.map((p) => (
              <li key={p.what} className="flex items-start gap-2">
                <CheckCircle2
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    p.urgency === "now"
                      ? "text-critical"
                      : p.urgency === "soon"
                        ? "text-warning-foreground"
                        : "text-primary"
                  }`}
                />
                <div>
                  <div className="text-foreground/90">{p.what}</div>
                  <div className="text-[11px] text-muted-foreground">{p.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-muted/40 p-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Целевые показатели</div>
        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
          {c.goals.map((g) => (
            <div key={g.metric} className="flex items-center justify-between rounded-lg bg-card p-2 text-sm">
              <span className="text-foreground/90">{g.metric}</span>
              <span className="text-right">
                <div className="font-semibold text-primary">{g.target}</div>
                <div className="text-[11px] text-muted-foreground">{g.horizon}</div>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Прогноз</div>
          <p className="mt-1 text-sm text-foreground/85">{c.forecast}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Клинические рекомендации</div>
          <ul className="mt-1 space-y-0.5 text-sm">
            {c.guidelines.map((g) => (
              <li key={g.name} className="flex items-center gap-1.5 text-foreground/85">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <span>{g.name}</span>
                <span className="text-[11px] text-muted-foreground">· {g.ref}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

/* ───────── Динамика ───────── */

type MetricSeries = {
  id: string;
  name: string;
  unit: string;
  system: string;
  tone: "success" | "warning" | "critical" | "primary";
  ref: [number, number];
  points: { date: string; value: number }[];
};

const METRIC_SERIES: MetricSeries[] = [
  {
    id: "ferritin",
    name: "Ферритин",
    unit: "нг/мл",
    system: "Кроветворение",
    tone: "success",
    ref: [30, 200],
    points: [
      { date: "Янв", value: 14 },
      { date: "Фев", value: 18 },
      { date: "Мар", value: 22 },
      { date: "Апр", value: 26 },
      { date: "Май", value: 30 },
      { date: "Июн", value: 32 },
    ],
  },
  {
    id: "ldl",
    name: "ЛПНП",
    unit: "ммоль/л",
    system: "Сердце и сосуды",
    tone: "warning",
    ref: [0, 3],
    points: [
      { date: "Янв", value: 3.6 },
      { date: "Фев", value: 3.8 },
      { date: "Мар", value: 4.1 },
      { date: "Апр", value: 4.4 },
      { date: "Май", value: 4.7 },
      { date: "Июн", value: 4.9 },
    ],
  },
  {
    id: "weight",
    name: "Вес",
    unit: "кг",
    system: "Метаболизм",
    tone: "primary",
    ref: [70, 85],
    points: [
      { date: "Янв", value: 95 },
      { date: "Фев", value: 93 },
      { date: "Мар", value: 92 },
      { date: "Апр", value: 91 },
      { date: "Май", value: 90 },
      { date: "Июн", value: 89 },
    ],
  },
  {
    id: "sbp",
    name: "АД систолическое",
    unit: "мм рт. ст.",
    system: "Сердце и сосуды",
    tone: "success",
    ref: [110, 130],
    points: [
      { date: "Янв", value: 152 },
      { date: "Фев", value: 148 },
      { date: "Мар", value: 145 },
      { date: "Апр", value: 142 },
      { date: "Май", value: 140 },
      { date: "Июн", value: 138 },
    ],
  },
  {
    id: "glucose",
    name: "Глюкоза натощак",
    unit: "ммоль/л",
    system: "Метаболизм",
    tone: "success",
    ref: [3.9, 6.1],
    points: [
      { date: "Янв", value: 5.6 },
      { date: "Фев", value: 5.5 },
      { date: "Мар", value: 5.5 },
      { date: "Апр", value: 5.4 },
      { date: "Май", value: 5.4 },
      { date: "Июн", value: 5.4 },
    ],
  },
  {
    id: "vitd",
    name: "Витамин D",
    unit: "нг/мл",
    system: "Гормоны",
    tone: "critical",
    ref: [30, 80],
    points: [
      { date: "Янв", value: 9 },
      { date: "Фев", value: 10 },
      { date: "Мар", value: 11 },
      { date: "Апр", value: 11 },
      { date: "Май", value: 12 },
      { date: "Июн", value: 12 },
    ],
  },
  {
    id: "hb",
    name: "Гемоглобин",
    unit: "г/л",
    system: "Кроветворение",
    tone: "success",
    ref: [130, 170],
    points: [
      { date: "Янв", value: 132 },
      { date: "Фев", value: 134 },
      { date: "Мар", value: 135 },
      { date: "Апр", value: 136 },
      { date: "Май", value: 137 },
      { date: "Июн", value: 138 },
    ],
  },
  {
    id: "tsh",
    name: "ТТГ",
    unit: "мЕд/л",
    system: "Гормоны",
    tone: "success",
    ref: [0.4, 4.0],
    points: [
      { date: "Янв", value: 2.1 },
      { date: "Мар", value: 2.3 },
      { date: "Июн", value: 2.0 },
    ],
  },
];

function computeStatus(s: MetricSeries): { tone: "success" | "warning" | "critical"; label: string } {
  const last = s.points[s.points.length - 1].value;
  if (last < s.ref[0] || last > s.ref[1]) {
    const delta = last < s.ref[0] ? s.ref[0] - last : last - s.ref[1];
    const pct = (delta / ((s.ref[0] + s.ref[1]) / 2)) * 100;
    return pct > 25 ? { tone: "critical", label: "Вне нормы" } : { tone: "warning", label: "Близко к границе" };
  }
  return { tone: "success", label: "В норме" };
}

function trendDelta(s: MetricSeries) {
  const first = s.points[0].value;
  const last = s.points[s.points.length - 1].value;
  const diff = last - first;
  return { diff, up: diff > 0 };
}

function DynamicsTab() {
  const systems = useMemo(() => Array.from(new Set(METRIC_SERIES.map((m) => m.system))), []);
  const [filter, setFilter] = useState<string>("Все");
  const [selectedId, setSelectedId] = useState<string>(METRIC_SERIES[0].id);
  const filtered = filter === "Все" ? METRIC_SERIES : METRIC_SERIES.filter((m) => m.system === filter);
  const selected = METRIC_SERIES.find((m) => m.id === selectedId) ?? METRIC_SERIES[0];

  return (
    <div className="space-y-5">
      {/* Сводные счётчики */}
      <section className="grid gap-3 sm:grid-cols-4">
        <SummaryStat value={String(METRIC_SERIES.length)} label="Показателей" tone="primary" />
        <SummaryStat
          value={String(METRIC_SERIES.filter((m) => computeStatus(m).tone === "success").length)}
          label="В норме"
          tone="success"
        />
        <SummaryStat
          value={String(METRIC_SERIES.filter((m) => computeStatus(m).tone === "warning").length)}
          label="Требуют внимания"
          tone="warning"
        />
        <SummaryStat
          value={String(METRIC_SERIES.filter((m) => computeStatus(m).tone === "critical").length)}
          label="Вне нормы"
          tone="primary"
        />
      </section>

      {/* Большой график выбранного показателя */}
      <section className="surface-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {selected.system}
            </div>
            <h3 className="text-lg font-bold">
              {selected.name}{" "}
              <span className="text-sm font-normal text-muted-foreground">({selected.unit})</span>
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-gradient-primary">
                {selected.points[selected.points.length - 1].value}
              </span>
              <TrendBadge series={selected} />
            </div>
          </div>
          <div className="text-right text-[11px] text-muted-foreground">
            Норма: <span className="font-semibold text-foreground">{selected.ref[0]}–{selected.ref[1]}</span>
          </div>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selected.points} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <ReferenceArea y1={selected.ref[0]} y2={selected.ref[1]} fill="hsl(var(--success))" fillOpacity={0.08} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Фильтр и сетка sparkline */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <SectionTitle title="Все показатели" hint="Нажмите карточку, чтобы развернуть график" />
          <div className="flex flex-wrap gap-1.5">
            {(["Все", ...systems] as string[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === s
                    ? "gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => {
            const status = computeStatus(m);
            const trend = trendDelta(m);
            const last = m.points[m.points.length - 1].value;
            const isActive = m.id === selectedId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedId(m.id)}
                className={`surface-card surface-card-hover p-4 text-left transition ${
                  isActive ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.system}</div>
                    <div className="text-sm font-semibold">{m.name}</div>
                  </div>
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">{last}</span>
                  <span className="text-[11px] text-muted-foreground">{m.unit}</span>
                  <span
                    className={`ml-auto inline-flex items-center gap-0.5 text-[11px] font-semibold ${
                      trend.up ? "text-warning-foreground" : "text-success"
                    }`}
                  >
                    {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {trend.diff > 0 ? "+" : ""}
                    {trend.diff.toFixed(1)}
                  </span>
                </div>

                <div className="mt-2 h-12 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={m.points} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <ReferenceArea y1={m.ref[0]} y2={m.ref[1]} fill="hsl(var(--success))" fillOpacity={0.1} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                          status.tone === "critical"
                            ? "hsl(var(--critical))"
                            : status.tone === "warning"
                              ? "hsl(var(--warning))"
                              : "hsl(var(--primary))"
                        }
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>{m.points[0].date}</span>
                  <span>норма {m.ref[0]}–{m.ref[1]}</span>
                  <span>{m.points[m.points.length - 1].date}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Сводная тепловая полоска */}
      <section>
        <SectionTitle title="Карта состояний" hint="Наглядно: что в норме, что требует внимания" />
        <div className="surface-card overflow-hidden">
          <div className="divide-y divide-border">
            {METRIC_SERIES.map((m) => {
              const status = computeStatus(m);
              return (
                <div key={m.id} className="flex items-center gap-3 p-3">
                  <div className="w-40 shrink-0">
                    <div className="text-sm font-semibold">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">{m.system}</div>
                  </div>
                  <div className="flex flex-1 gap-1">
                    {m.points.map((p, i) => {
                      const inRange = p.value >= m.ref[0] && p.value <= m.ref[1];
                      const tone = inRange
                        ? "bg-success/60"
                        : p.value > m.ref[1] * 1.25 || p.value < m.ref[0] * 0.75
                          ? "bg-critical/70"
                          : "bg-warning/60";
                      return (
                        <div
                          key={i}
                          title={`${p.date}: ${p.value} ${m.unit}`}
                          className={`flex-1 rounded-md ${tone} transition-all hover:opacity-80`}
                          style={{ height: 28 }}
                        />
                      );
                    })}
                  </div>
                  <div className="w-24 shrink-0 text-right">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Напоминания по контролю" />
        <div className="space-y-2">
          {[
            { name: "Ферритин", when: "через 2 недели" },
            { name: "Липидограмма", when: "через 3 месяца" },
            { name: "АД (дневник)", when: "ежедневно" },
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

function TrendBadge({ series }: { series: MetricSeries }) {
  const t = trendDelta(series);
  const status = computeStatus(series);
  return (
    <StatusBadge tone={status.tone}>
      {t.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {t.diff > 0 ? "+" : ""}
      {t.diff.toFixed(1)} {series.unit}
    </StatusBadge>
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

