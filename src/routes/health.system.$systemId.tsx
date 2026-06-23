import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bone,
  Brain,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Eye,
  FileText,
  HeartPulse,
  Plus,
  Shield,
  Stethoscope,
  TrendingUp,
  User,
  Wind,
} from "lucide-react";
import type { ComponentType } from "react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
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

type Tone = "success" | "warning" | "critical" | "default";

type SystemDetail = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  tone: Tone;
  summary: string;
  data: string;
  states: { name: string; tone: Tone; note: string }[];
  risks: { name: string; tone: Tone }[];
  metrics: { name: string; value: string; ref: string; tone: Tone }[];
  trend?: { name: string; unit: string; points: { date: string; value: number }[]; ref?: [number, number] };
  observations: { name: string; date: string }[];
  recommendations: { text: string; urgency: "now" | "soon" | "plan" }[];
};

const SYSTEMS: Record<string, SystemDetail> = {
  heart: {
    id: "heart",
    name: "Сердце и сосуды",
    icon: HeartPulse,
    tone: "warning",
    summary:
      "Эпизоды повышенного артериального давления и признаки варикозной болезни. Требует регулярного наблюдения.",
    data: "Информация достаточна",
    states: [
      { name: "Варикоз нижних конечностей", tone: "warning", note: "УЗИ вен от 03.2026" },
      { name: "Артериальная гипертензия I ст.", tone: "warning", note: "Серия измерений" },
    ],
    risks: [
      { name: "Повышенное давление более 3 дней", tone: "critical" },
      { name: "Малоподвижный образ жизни", tone: "warning" },
    ],
    metrics: [
      { name: "АД систолическое", value: "138 мм рт. ст.", ref: "<130", tone: "warning" },
      { name: "АД диастолическое", value: "88 мм рт. ст.", ref: "<85", tone: "warning" },
      { name: "ЧСС покоя", value: "72 уд/мин", ref: "60–80", tone: "success" },
      { name: "ЛПНП", value: "4.9 ммоль/л", ref: "<3.0", tone: "critical" },
    ],
    trend: {
      name: "АД систолическое",
      unit: "мм рт. ст.",
      points: [
        { date: "Янв", value: 152 },
        { date: "Фев", value: 148 },
        { date: "Мар", value: 145 },
        { date: "Апр", value: 142 },
        { date: "Май", value: 140 },
        { date: "Июн", value: 138 },
      ],
      ref: [110, 130],
    },
    observations: [
      { name: "УЗИ вен нижних конечностей", date: "03.2026" },
      { name: "ЭКГ", date: "06.2025" },
      { name: "Холтер 24ч", date: "Требуется" },
    ],
    recommendations: [
      { text: "Контроль АД утром и вечером, дневник давления", urgency: "now" },
      { text: "Консультация кардиолога", urgency: "soon" },
      { text: "Липидограмма + биохимия", urgency: "soon" },
    ],
  },
  hormones: {
    id: "hormones",
    name: "Гормоны",
    icon: Droplets,
    tone: "critical",
    summary: "Данных недостаточно. Последние гормональные анализы выполнены более 2 лет назад.",
    data: "Информация частична",
    states: [{ name: "Подозрение на субклинический гипотиреоз", tone: "warning", note: "По симптомам" }],
    risks: [
      { name: "Хроническая усталость", tone: "warning" },
      { name: "Семейный анамнез: гипотиреоз", tone: "warning" },
      { name: "Дефицит витамина D", tone: "critical" },
    ],
    metrics: [
      { name: "ТТГ", value: "—", ref: "0.4–4.0", tone: "default" },
      { name: "Т4 свободный", value: "—", ref: "9–22", tone: "default" },
      { name: "Витамин D", value: "12 нг/мл", ref: ">30", tone: "critical" },
    ],
    observations: [
      { name: "ТТГ", date: "Требуется" },
      { name: "Т4 свободный", date: "Требуется" },
      { name: "УЗИ щитовидной железы", date: "Требуется" },
    ],
    recommendations: [
      { text: "Сдать ТТГ, Т4 свободный, антитела ТПО", urgency: "now" },
      { text: "УЗИ щитовидной железы", urgency: "soon" },
      { text: "Витамин D 5000 МЕ/сут + контроль через 3 мес", urgency: "now" },
    ],
  },
  blood: {
    id: "blood",
    name: "Кроветворение",
    icon: Activity,
    tone: "warning",
    summary: "Латентный дефицит железа. Динамика на фоне терапии положительная.",
    data: "Информация частична",
    states: [{ name: "Латентный дефицит железа", tone: "warning", note: "Ферритин ниже нормы" }],
    risks: [{ name: "Низкое потребление железа с пищей", tone: "warning" }],
    metrics: [
      { name: "Ферритин", value: "32 нг/мл", ref: "30–200", tone: "success" },
      { name: "Гемоглобин", value: "138 г/л", ref: "130–170", tone: "success" },
      { name: "Сывороточное железо", value: "14 мкмоль/л", ref: "9–30", tone: "success" },
    ],
    trend: {
      name: "Ферритин",
      unit: "нг/мл",
      points: [
        { date: "Янв", value: 14 },
        { date: "Фев", value: 18 },
        { date: "Мар", value: 22 },
        { date: "Апр", value: 26 },
        { date: "Май", value: 30 },
        { date: "Июн", value: 32 },
      ],
      ref: [30, 200],
    },
    observations: [
      { name: "ОАК", date: "05.2026" },
      { name: "Ферритин", date: "06.2026" },
    ],
    recommendations: [
      { text: "Продолжить курс препаратов железа", urgency: "now" },
      { text: "Повторить ферритин через 2 недели", urgency: "soon" },
    ],
  },
  gi: {
    id: "gi",
    name: "ЖКТ",
    icon: Activity,
    tone: "success",
    summary: "Жалоб нет, объективных данных мало. Требуется базовое обновление обследований.",
    data: "Информации недостаточно",
    states: [],
    risks: [{ name: "Нерегулярное питание", tone: "warning" }],
    metrics: [
      { name: "АЛТ", value: "—", ref: "<40", tone: "default" },
      { name: "АСТ", value: "—", ref: "<40", tone: "default" },
    ],
    observations: [
      { name: "Биохимия", date: "Требуется" },
      { name: "УЗИ ОБП", date: "Требуется" },
    ],
    recommendations: [
      { text: "Биохимический анализ крови", urgency: "soon" },
      { text: "УЗИ органов брюшной полости", urgency: "plan" },
    ],
  },
  immune: {
    id: "immune",
    name: "Иммунитет",
    icon: Shield,
    tone: "default",
    summary: "Объективных данных нет. Рекомендуется базовая оценка.",
    data: "Информация отсутствует",
    states: [],
    risks: [],
    metrics: [],
    observations: [{ name: "Иммунограмма", date: "Требуется" }],
    recommendations: [{ text: "Базовая иммунограмма", urgency: "plan" }],
  },
  nervous: {
    id: "nervous",
    name: "Нервная система",
    icon: Brain,
    tone: "success",
    summary: "Жалоб нет. Сон и работоспособность в норме.",
    data: "Информация достаточна",
    states: [],
    risks: [],
    metrics: [{ name: "Качество сна", value: "Хорошее", ref: "Хорошее", tone: "success" }],
    observations: [],
    recommendations: [{ text: "Поддерживать режим сна", urgency: "plan" }],
  },
  skin: {
    id: "skin",
    name: "Кожа",
    icon: User,
    tone: "warning",
    summary: "Эпизоды акне, требуется наблюдение.",
    data: "Информация частична",
    states: [{ name: "Акне", tone: "warning", note: "Эпизодически" }],
    risks: [{ name: "Гормональные колебания", tone: "warning" }],
    metrics: [],
    observations: [{ name: "Консультация дерматолога", date: "Требуется" }],
    recommendations: [{ text: "Запись к дерматологу", urgency: "soon" }],
  },
  bones: {
    id: "bones",
    name: "Опорно-двигательная",
    icon: Bone,
    tone: "success",
    summary: "Жалоб нет. Активность достаточна.",
    data: "Информация достаточна",
    states: [],
    risks: [],
    metrics: [],
    observations: [],
    recommendations: [{ text: "Регулярная активность", urgency: "plan" }],
  },
  urinary: {
    id: "urinary",
    name: "Мочеполовая",
    icon: User,
    tone: "success",
    summary: "Без особенностей.",
    data: "Информация достаточна",
    states: [],
    risks: [],
    metrics: [],
    observations: [],
    recommendations: [],
  },
  vision: {
    id: "vision",
    name: "Органы зрения",
    icon: Eye,
    tone: "default",
    summary: "Данных нет. Рекомендован плановый осмотр.",
    data: "Информация отсутствует",
    states: [],
    risks: [],
    metrics: [],
    observations: [{ name: "Осмотр офтальмолога", date: "Требуется" }],
    recommendations: [{ text: "Плановый осмотр офтальмолога", urgency: "plan" }],
  },
  lungs: {
    id: "lungs",
    name: "Органы дыхания",
    icon: Wind,
    tone: "success",
    summary: "Без особенностей.",
    data: "Информация достаточна",
    states: [],
    risks: [],
    metrics: [{ name: "SpO₂", value: "98%", ref: ">95%", tone: "success" }],
    observations: [],
    recommendations: [],
  },
};

export const SYSTEM_LIST = Object.values(SYSTEMS).map((s) => ({
  id: s.id,
  name: s.name,
  icon: s.icon,
  tone: s.tone,
  data: s.data,
  states: s.states.length,
  risks: s.risks.length,
  note: s.recommendations[0]?.text ?? "Норма",
}));

export const Route = createFileRoute("/health/system/$systemId")({
  loader: ({ params }): { system: SystemDetail } => {
    const system = SYSTEMS[params.systemId];
    if (!system) throw notFound();
    return { system };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Lify — ${loaderData?.system.name ?? "Система"}` },
      { name: "description", content: loaderData?.system.summary ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="surface-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Раздел не найден.</p>
        <Link to="/health" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          ← Вернуться к здоровью
        </Link>
      </div>
    </AppShell>
  ),
  errorComponent: ({ reset }) => (
    <AppShell>
      <div className="surface-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Не удалось загрузить раздел.</p>
        <button onClick={() => reset()} className="mt-3 text-sm font-semibold text-primary hover:underline">
          Повторить
        </button>
      </div>
    </AppShell>
  ),
  component: SystemPage,
});

function SystemPage() {
  const { system } = Route.useLoaderData();
  const Icon = system.icon;
  const toneClass: Record<Tone, string> = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    critical: "bg-critical/15 text-critical",
    default: "bg-muted text-muted-foreground",
  };
  return (
    <AppShell>
      <div className="mb-4">
        <Link
          to="/health"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> К разделу «Здоровье»
        </Link>
      </div>

      <section className="surface-card mb-5 overflow-hidden">
        <div className="relative p-5">
          <div className="absolute inset-0 gradient-primary opacity-[0.06]" aria-hidden />
          <div className="relative flex items-start gap-4">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${toneClass[system.tone]}`}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Система</p>
              <h1 className="mt-0.5 text-2xl font-bold tracking-tight md:text-3xl">{system.name}</h1>
              <p className="mt-1 text-sm text-foreground/80">{system.summary}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge tone={system.tone === "default" ? "default" : system.tone}>{system.data}</StatusBadge>
                <StatusBadge tone="primary">{system.states.length} состояний</StatusBadge>
                <StatusBadge tone="default">{system.risks.length} факторов риска</StatusBadge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {system.metrics.length > 0 && (
        <section className="mb-5">
          <SectionTitle title="Ключевые показатели" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {system.metrics.map((m) => (
              <div key={m.name} className="surface-card p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.name}</div>
                <div
                  className={`mt-1 text-xl font-bold ${
                    m.tone === "critical"
                      ? "text-critical"
                      : m.tone === "warning"
                        ? "text-warning-foreground"
                        : m.tone === "success"
                          ? "text-success"
                          : "text-foreground"
                  }`}
                >
                  {m.value}
                </div>
                <div className="text-[11px] text-muted-foreground">норма: {m.ref}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {system.trend && (
        <section className="mb-5">
          <SectionTitle title="Динамика" hint={`${system.trend.name}, ${system.trend.unit}`} />
          <div className="surface-card p-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={system.trend.points} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
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
                  {system.trend.ref && (
                    <ReferenceArea
                      y1={system.trend.ref[0]}
                      y2={system.trend.ref[1]}
                      fill="hsl(var(--success))"
                      fillOpacity={0.08}
                    />
                  )}
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
          </div>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {system.states.length > 0 && (
          <section>
            <SectionTitle title="Состояния" />
            <div className="space-y-2">
              {system.states.map((s) => (
                <div key={s.name} className="surface-card flex items-start gap-3 p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">{s.note}</div>
                  </div>
                  <StatusBadge tone={s.tone === "default" ? "default" : s.tone}>Активно</StatusBadge>
                </div>
              ))}
            </div>
          </section>
        )}

        {system.risks.length > 0 && (
          <section>
            <SectionTitle title="Факторы риска" />
            <div className="space-y-2">
              {system.risks.map((r) => (
                <div key={r.name} className="surface-card flex items-start gap-3 p-4">
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                      r.tone === "critical" ? "bg-critical/15 text-critical" : "bg-warning/20 text-warning-foreground"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-medium">{r.name}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {system.observations.length > 0 && (
          <section>
            <SectionTitle title="Обследования" />
            <div className="space-y-2">
              {system.observations.map((o) => (
                <div key={o.name} className="surface-card flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div className="text-sm font-medium">{o.name}</div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{o.date}</span>
                </div>
              ))}
              <button className="surface-card surface-card-hover flex w-full items-center justify-center gap-2 p-3 text-sm font-medium text-primary">
                <Plus className="h-4 w-4" /> Добавить обследование
              </button>
            </div>
          </section>
        )}

        {system.recommendations.length > 0 && (
          <section>
            <SectionTitle title="Что делать" />
            <div className="space-y-2">
              {system.recommendations.map((r) => (
                <div key={r.text} className="surface-card flex items-start gap-3 p-4">
                  <CheckCircle2
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      r.urgency === "now" ? "text-critical" : r.urgency === "soon" ? "text-warning-foreground" : "text-primary"
                    }`}
                  />
                  <div className="flex-1 text-sm">{r.text}</div>
                  <StatusBadge
                    tone={r.urgency === "now" ? "critical" : r.urgency === "soon" ? "warning" : "primary"}
                  >
                    {r.urgency === "now" ? "Срочно" : r.urgency === "soon" ? "В течение месяца" : "Планово"}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/treatment"
          className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          <TrendingUp className="h-4 w-4" /> Открыть лечение
        </Link>
        <Link
          to="/team"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          К команде врачей <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </AppShell>
  );
}
