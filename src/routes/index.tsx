import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Droplet,
  FlaskConical,
  HeartPulse,
  Phone,
  Sparkles,
  Stethoscope,
  UserPlus,
  MessageSquare,
  Ambulance,
  CheckCircle2,
  FileText,
  Circle,
  Plus,
  CalendarPlus,
  Activity,
  Send,
  Youtube,
  Instagram,
  Music2,
  FlaskRound,
  Users,
} from "lucide-react";
import { Share2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import doctorPhoto from "@/assets/doctor-petrov.jpg";
import { IncidentChatDialog } from "@/components/incident-chat-dialog";
import { ShareDialog } from "@/components/share-dialog";
import { useCases, type StoredCase } from "@/lib/cases-store";
import type { ShareScope } from "@/lib/share-links-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lify — Личный кабинет" },
      {
        name: "description",
        content:
          "Что происходит с вашим здоровьем сейчас: состояние, активные обращения, консультации и назначения.",
      },
    ],
  }),
  component: HomePage,
});

type ModalKey = null | "incident" | "doctor" | "emergency";

const heroSlides = [
  {
    eyebrow: "Первый шаг",
    title: "Полный чекап организма",
    subtitle: "Базовая оценка здоровья за 7 дней",
    cta: "Начать чекап",
    secondary: "Узнать больше",
    bg: "linear-gradient(135deg, hsl(214 95% 50%) 0%, hsl(190 85% 50%) 100%)",
  },
  {
    eyebrow: "Программа",
    title: "Контроль хронических состояний",
    subtitle: "Под наблюдением профильного врача",
    cta: "Подключить",
    secondary: "Подробнее",
    bg: "linear-gradient(135deg, hsl(190 75% 55%) 0%, hsl(30 95% 60%) 100%)",
  },
];

const activeCases = [
  {
    title: "Варикоз",
    number: "№121",
    diagnosis: "Варикоз",
    specialist: "Артем Сергеевич Петров",
    next: "Прием терапевта 15 апреля в 13:40",
  },
  {
    title: "Гипертония",
    number: "№118",
    diagnosis: "Артериальная гипертензия I ст.",
    specialist: "Иванов И.И.",
    next: "Контроль давления, 12 апреля",
  },
];

const consultations = [
  { when: "Завтра", time: "13:40", doctor: "Артем Сергеевич Петров", role: "Терапевт", type: "Видеоконсультация", soon: true },
  { when: "15 апреля", time: "13:40", doctor: "Артем Сергеевич Петров", role: "Терапевт", type: "Видеоконсультация", soon: false },
];

const prescriptions = [
  { name: "Аскорбиновая кислота", dose: "2 мг 3 раза в день" },
  { name: "Аскорбиновая кислота", dose: "2 мг 3 раза в день" },
  { name: "Аскорбиновая кислота", dose: "2 мг 3 раза в день" },
];

function HomePage() {
  const profileProgress = 64;
  const [modal, setModal] = useState<ModalKey>(null);
  const [share, setShare] = useState<{ scope: ShareScope; caseTitle?: string; context?: string } | null>(null);
  const [slide, setSlide] = useState(0);
  const [taken, setTaken] = useState<Record<number, boolean>>({});
  const userCases = useCases();
  const close = () => setModal(null);

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Greeting */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Сегодня · 09:30
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Доброе утро, Алексей
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShare({ scope: "full", context: "Вся медкарта" })}
              className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
            >
              <Share2 className="h-4 w-4" /> Поделиться медкартой
            </button>
            <StatusBadge tone="success">Всё под контролем</StatusBadge>
          </div>
        </div>

        {/* Медкарта */}
        <section className="surface-card overflow-hidden">
          <div className="relative p-5">
            <div className="absolute inset-0 gradient-primary opacity-[0.06]" aria-hidden />
            <div className="relative flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">Заполните медицинскую карту</h3>
                  <span className="text-xs font-medium text-muted-foreground">{profileProgress}%</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Чем полнее данные — тем точнее рекомендации и работа врачей.
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full gradient-primary transition-[width] duration-500"
                    style={{ width: `${profileProgress}%` }}
                  />
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Продолжить заполнение <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Hero программы */}
        <section>
          <div className="grid gap-3 md:grid-cols-3">
            <HeroCard slide={heroSlides[0]} className="md:col-span-2 md:min-h-[180px]" />
            <HeroCard slide={heroSlides[1]} className="md:min-h-[180px]" compact />
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Слайд ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  slide === i ? "w-5 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Main + Sidebar */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* MAIN */}
          <div className="space-y-5 lg:col-span-2">
            {/* Быстрые действия */}
            <section>
              <SectionTitle title="Быстрые действия" />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <QuickPill label="Новое обращение" tone="primary" onClick={() => setModal("incident")} />
                <QuickPill label="Записаться к врачу" tone="muted" onClick={() => setModal("doctor")} />
                <QuickPill label="Сдать анализы" tone="muted" />
                <QuickPill label="Срочная помощь" tone="critical" onClick={() => setModal("emergency")} />
              </div>
            </section>

            {/* Активные обращения */}
            <section>
              <SectionTitle
                title="Активные обращения"
                hint="Случаи, которыми вы занимаетесь сейчас"
                action={
                  <Link to="/treatment" className="text-xs font-semibold text-primary hover:underline">
                    Все случаи
                  </Link>
                }
              />
              <div className="space-y-3">
                {userCases.map((c) => (
                  <UserCaseCard
                    key={c.id}
                    c={c}
                    onShare={() => setShare({ scope: "case", caseTitle: c.title, context: c.title })}
                  />
                ))}
                {activeCases.map((c, i) => (
                  <CaseCard
                    key={i}
                    {...c}
                    onShare={() => setShare({ scope: "case", caseTitle: c.title, context: `${c.title} ${c.number}` })}
                  />
                ))}
              </div>
            </section>

            {/* Запланированные консультации */}
            <section>
              <SectionTitle
                title="Запланированные консультации"
                action={
                  <Link to="/team" className="text-xs font-semibold text-primary hover:underline">
                    Все консультации
                  </Link>
                }
              />
              <div className="space-y-3">
                {consultations.map((c, i) => (
                  <ConsultationCard key={i} {...c} />
                ))}
              </div>
            </section>

            {/* Ближайшие действия */}
            <section>
              <SectionTitle title="Ближайшие действия" hint="Чек-лист на эту неделю" />
              <div className="space-y-2">
                {[
                  { label: "Сдать ферритин + ОЖСС", meta: "Срочно · просрочено на 9 дней", tone: "critical" as const },
                  { label: "Пройти УЗИ вен", meta: "В течение месяца · по случаю «Варикоз»", tone: "warning" as const },
                  { label: "Контроль артериального давления", meta: "Ежедневно утром и вечером", tone: "primary" as const },
                  { label: "Записаться на ежегодный чекап", meta: "Планово · до 15 июня", tone: "muted" as const },
                ].map((a, i) => (
                  <UpcomingAction key={i} {...a} done={!!taken[1000 + i]} onToggle={() => setTaken((t) => ({ ...t, [1000 + i]: !t[1000 + i] }))} />
                ))}
              </div>
            </section>

            {/* Назначения */}
            <section>
              <SectionTitle
                title="Назначения"
                action={
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    Все назначения <ArrowRight className="h-3 w-3" />
                  </button>
                }
              />
              <div className="space-y-2">
                {prescriptions.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTaken((t) => ({ ...t, [i]: !t[i] }))}
                    className="surface-card surface-card-hover flex w-full items-center gap-3 p-3 text-left"
                  >
                    {taken[i] ? (
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
                    ) : (
                      <Circle className="h-6 w-6 shrink-0 text-muted-foreground/40" />
                    )}
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${taken[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {p.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{p.dose}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="surface-card surface-card-hover inline-flex items-center justify-center gap-1.5 p-2.5 text-xs font-medium text-foreground">
                  <Plus className="h-4 w-4" /> Добавить своё назначение
                </button>
                <button className="surface-card surface-card-hover inline-flex items-center justify-center gap-1.5 p-2.5 text-xs font-medium text-foreground">
                  <CalendarPlus className="h-4 w-4" /> Экспорт в календарь
                </button>
              </div>
            </section>

            {/* Рекомендации ИИ */}
            <section>
              <SectionTitle title="Рекомендации ИИ для вас" />
              <div className="surface-card space-y-3 p-5" style={{ background: "hsl(214 60% 97%)" }}>
                <div className="rounded-xl border border-primary/10 bg-card p-4">
                  <div className="text-sm font-semibold text-foreground">На основе последнего анализа:</div>
                  <ul className="mt-2 space-y-1 text-xs text-foreground/80">
                    <li>• Увеличьте потребление воды на 500 мл/день</li>
                    <li>• Рекомендуем добавить цинк в рацион</li>
                    <li>• Снижение воспалений на 15% за неделю</li>
                  </ul>
                  <div className="mt-3 rounded-xl bg-primary/5 p-3">
                    <div className="text-xs font-semibold text-primary">Персональный совет:</div>
                    <div className="mt-1 text-xs text-foreground/80">
                      «Ваша кожа хорошо реагирует на витамин С — продолжайте курс»
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Оптимальное время для следующего анализа: через 2 дня
                </p>
              </div>
            </section>

            {/* Персональные инсайты */}
            <section>
              <SectionTitle title="Персональные инсайты от ИИ" />
              <div className="surface-card p-5">
                <ul className="space-y-2 text-xs text-foreground/80">
                  <li>• «Ваша кожа лучше реагирует на утренние процедуры»</li>
                  <li>• «Заметили связь между стрессом и высыпаниями?»</li>
                  <li>• «Пик эффективности лечения приходится на вторую неделю цикла»</li>
                </ul>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4">
            {/* Сводка состояния */}
            <section className="surface-card p-4">
              <div className="text-sm font-semibold text-foreground">Сводка состояния</div>
              <div className="mt-3 flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-success/15 text-success">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Стабильно</div>
                  <div className="text-[11px] text-muted-foreground">Обновлено сегодня в 09:30</div>
                </div>
              </div>
              <Link
                to="/health"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Подробнее <ArrowRight className="h-3 w-3" />
              </Link>
            </section>

            {/* Доктор */}
            <section className="surface-card overflow-hidden">
              <img
                src={doctorPhoto}
                alt="Доктор Артем Сергеевич Петров"
                width={640}
                height={640}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <div className="space-y-3 p-4">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Доктор Артем Сергеевич Петров
                  </div>
                  <div className="text-xs text-muted-foreground">Терапевт</div>
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                  <dt className="text-muted-foreground">Обращение</dt>
                  <dd className="font-medium text-foreground">№121</dd>
                  <dt className="text-muted-foreground">Диагноз</dt>
                  <dd className="font-medium text-foreground">Варикоз</dd>
                </dl>
                <div className="rounded-xl bg-success/15 p-2.5">
                  <div className="text-xs font-semibold text-foreground">Следующий приём</div>
                  <div className="text-xs text-success-foreground">Завтра 13:40</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted">
                    Написать
                  </button>
                  <button className="rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
                    Консультация
                  </button>
                </div>
              </div>
            </section>

            {/* Быстрые действия (sidebar) */}
            <section className="surface-card p-4">
              <div className="mb-3 text-sm font-semibold text-foreground">Быстрые действия</div>
              <div className="space-y-2">
                <SideAction label="Новое обращение" tone="primary" onClick={() => setModal("incident")} />
                <SideAction label="Срочная помощь" tone="critical" onClick={() => setModal("emergency")} />
                <SideAction label="Записаться к врачу" onClick={() => setModal("doctor")} />
                <SideAction label="Сдать анализы" />
                <SideAction label="Полное обследование организма" />
                <SideAction label="Контроль хронического состояния" />
              </div>
            </section>

            {/* Последние изменения */}
            <section className="surface-card p-4">
              <div className="mb-1 text-sm font-semibold text-foreground">Последние изменения</div>
              <div className="mb-3 text-[11px] text-muted-foreground">Сегодня</div>
              <ol className="relative space-y-3 border-l border-border pl-4">
                <TimelineItem
                  icon={Droplet}
                  tone="primary"
                  title="Получен общий анализ крови"
                  meta="Лаборатория Гемотест · 09:14"
                />
                <TimelineItem
                  icon={FlaskConical}
                  tone="accent"
                  title="Врач добавил назначение"
                  meta="Иванов И.И. · 08:47"
                />
                <TimelineItem
                  icon={Sparkles}
                  tone="success"
                  title="Создана рекомендация"
                  meta="Сдать ферритин до 15 июня"
                />
              </ol>
            </section>
          </aside>
        </div>

      </div>

      {/* === Что случилось? — чат с ИИ-врачом === */}
      <IncidentChatDialog open={modal === "incident"} onOpenChange={(o) => !o && close()} />

      {/* === Share === */}
      <ShareDialog
        open={share !== null}
        onOpenChange={(o) => !o && setShare(null)}
        initialScope={share?.scope ?? "full"}
        caseTitle={share?.caseTitle}
        context={share?.context}
      />


      {/* === Нужен врач === */}
      <Dialog open={modal === "doctor"} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <UserPlus className="h-5 w-5" />
              </span>
              Записаться к врачу
            </DialogTitle>
            <DialogDescription>Выберите способ обращения к специалисту.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <DoctorOption
              icon={MessageSquare}
              title="Чат с дежурным терапевтом"
              meta="Ответ ~ 5 минут · бесплатно"
              onClick={() => {
                toast.success("Открываем чат с дежурным терапевтом…");
                close();
              }}
            />
            <DoctorOption
              icon={CalendarClock}
              title="Записаться к специалисту"
              meta="Подберём врача по вашему случаю"
              to="/team"
              onClick={close}
            />
            <DoctorOption
              icon={Stethoscope}
              title="Видеоконсультация сейчас"
              meta="Свободные врачи онлайн"
              onClick={() => {
                toast.success("Ищем доступного врача…");
                close();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* === Срочная помощь === */}
      <Dialog open={modal === "emergency"} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-critical">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-critical/15 text-critical">
                <Ambulance className="h-5 w-5" />
              </span>
              Срочная помощь
            </DialogTitle>
            <DialogDescription>
              Если есть угроза жизни — звоните 112. Ниже — быстрый доступ к экстренным службам.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <a href="tel:112" className="surface-card surface-card-hover flex items-center gap-3 p-3" onClick={close}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-critical text-white">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground">112 — Единая служба</div>
                <div className="text-xs text-muted-foreground">Скорая, МЧС, полиция</div>
              </div>
            </a>
            <a href="tel:103" className="surface-card surface-card-hover flex items-center gap-3 p-3" onClick={close}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-critical/15 text-critical">
                <Ambulance className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground">103 — Скорая помощь</div>
                <div className="text-xs text-muted-foreground">Прямой вызов бригады</div>
              </div>
            </a>
            <button
              type="button"
              onClick={() => {
                toast.success("Вызываем дежурного врача Lify…", {
                  description: "Перезвонит в течение 2 минут.",
                });
                close();
              }}
              className="surface-card surface-card-hover flex items-center gap-3 p-3 text-left"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground">Дежурный врач Lify</div>
                <div className="text-xs text-muted-foreground">Перезвоним в течение 2 минут</div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function HeroCard({
  slide,
  className = "",
  compact = false,
}: {
  slide: (typeof heroSlides)[number];
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-[var(--shadow-lg)] ${className}`}
      style={{ background: slide.bg }}
    >
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top_right,white,transparent_60%)]" aria-hidden />
      <div className="relative flex h-full flex-col">
        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] opacity-90">
          {slide.eyebrow}
        </div>
        <h3 className={`mt-2 font-bold leading-tight ${compact ? "text-lg" : "text-2xl md:text-3xl"}`}>
          {slide.title}
        </h3>
        <p className="mt-1 text-xs opacity-90">{slide.subtitle}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-[var(--shadow-md)] transition-transform hover:scale-[1.02]">
            {slide.cta} <ArrowRight className="h-3.5 w-3.5" />
          </button>
          {!compact && (
            <button className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25">
              {slide.secondary}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function UpcomingAction({
  label,
  meta,
  tone,
  done,
  onToggle,
}: {
  label: string;
  meta: string;
  tone: "critical" | "warning" | "primary" | "muted";
  done: boolean;
  onToggle: () => void;
}) {
  const toneCls = {
    critical: "border-l-4 border-l-critical",
    warning: "border-l-4 border-l-warning",
    primary: "border-l-4 border-l-primary",
    muted: "border-l-4 border-l-border",
  }[tone];
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`surface-card surface-card-hover flex w-full items-center gap-3 p-3 text-left ${toneCls}`}
    >
      {done ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
      ) : (
        <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" />
      )}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
          {label}
        </div>
        <div className="text-[11px] text-muted-foreground">{meta}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function QuickPill({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone: "primary" | "muted" | "critical";
  onClick?: () => void;
}) {
  const tones: Record<typeof tone, string> = {
    primary: "gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]",
    muted: "bg-muted text-foreground hover:bg-secondary",
    critical: "bg-critical text-white hover:opacity-95",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-3 text-xs font-semibold transition-all ${tones[tone]}`}
    >
      {label}
    </button>
  );
}

function SideAction({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone?: "primary" | "critical";
  onClick?: () => void;
}) {
  const cls =
    tone === "primary"
      ? "gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]"
      : tone === "critical"
        ? "bg-critical text-white"
        : "bg-muted text-foreground hover:bg-secondary";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-2 text-xs font-semibold transition-all ${cls}`}
    >
      {label}
    </button>
  );
}

function CaseCard({
  title,
  number,
  diagnosis,
  specialist,
  next,
  onShare,
}: {
  title: string;
  number: string;
  diagnosis: string;
  specialist: string;
  next: string;
  onShare?: () => void;
}) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-4 w-4" />
          </div>
          <div className="text-base font-semibold text-foreground">{title}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/3 rounded-full gradient-primary" />
          </div>
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              title="Поделиться кейсом"
              className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-card text-foreground hover:bg-muted"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-[140px_1fr] gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-muted-foreground">Номер обращения:</dt>
        <dd className="font-medium text-foreground">{number}</dd>
        <dt className="text-muted-foreground">Диагноз:</dt>
        <dd className="font-medium text-foreground">{diagnosis}</dd>
        <dt className="text-muted-foreground">Специалист:</dt>
        <dd className="font-medium text-foreground">{specialist}</dd>
        <dt className="text-muted-foreground">Следующее действие:</dt>
        <dd className="font-medium text-foreground">{next}</dd>
      </dl>
      <Link
        to="/case/$id"
        params={{ id: number.replace(/^№/, "") }}
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl gradient-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
      >
        <FileText className="h-4 w-4" /> Открыть карточку обращения
      </Link>
    </div>
  );
}

function UrgencyBadge({ urgency }: { urgency: StoredCase["urgency"] }) {
  const map = {
    low: { label: "Низкая", cls: "bg-success/20 text-success-foreground" },
    medium: { label: "Средняя", cls: "bg-warning/20 text-warning-foreground" },
    high: { label: "Высокая", cls: "bg-warning/30 text-warning-foreground" },
    critical: { label: "Критично", cls: "bg-critical/15 text-critical" },
  } as const;
  const u = map[urgency];
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${u.cls}`}>{u.label}</span>
  );
}

function UserCaseCard({ c, onShare }: { c: StoredCase; onShare?: () => void }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-base font-semibold text-foreground">{c.title}</div>
            <div className="text-[11px] text-muted-foreground">
              {c.number} · Создано ИИ-врачом
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UrgencyBadge urgency={c.urgency} />
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              title="Поделиться кейсом"
              className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-card text-foreground hover:bg-muted"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
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
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {c.tests.length > 0 && (
          <div className="rounded-xl bg-muted/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
              <FlaskRound className="h-3.5 w-3.5 text-primary" /> Анализы
            </div>
            <ul className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
              {c.tests.slice(0, 4).map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          </div>
        )}
        {c.specialists.length > 0 && (
          <div className="rounded-xl bg-muted/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" /> Специалисты
            </div>
            <ul className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
              {c.specialists.slice(0, 4).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link
        to="/treatment"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl gradient-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
      >
        <FileText className="h-4 w-4" /> Открыть карточку обращения
      </Link>
    </div>
  );
}

function ConsultationCard({
  when,
  time,
  doctor,
  role,
  type,
  soon,
}: {
  when: string;
  time: string;
  doctor: string;
  role: string;
  type: string;
  soon: boolean;
}) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center gap-2">
        {soon ? (
          <span className="rounded-md bg-success/20 px-2 py-0.5 text-[11px] font-semibold text-success-foreground">
            {when}
          </span>
        ) : (
          <span className="text-xs font-medium text-foreground">{when}</span>
        )}
        <span className="text-xs font-semibold text-foreground">{time}</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground">{doctor}</div>
      <div className="text-xs text-muted-foreground">
        {role} · {type}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button
          onClick={() => toast.success("Подключаемся к консультации…")}
          className="rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Присоединиться
        </button>
        <button
          onClick={() => toast("Консультация отменена")}
          className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
        >
          Отменить
        </button>
      </div>
    </div>
  );
}

function DoctorOption({
  icon: Icon,
  title,
  meta,
  to,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  meta: string;
  to?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{meta}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </>
  );
  if (to) {
    return (
      <Link to={to} onClick={onClick} className="surface-card surface-card-hover flex items-center gap-3 p-3">
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="surface-card surface-card-hover flex items-center gap-3 p-3 text-left"
    >
      {inner}
    </button>
  );
}

function TimelineItem({
  icon: Icon,
  tone,
  title,
  meta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "primary" | "accent" | "success";
  title: string;
  meta: string;
}) {
  const tones: Record<typeof tone, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/40 text-accent-foreground",
    success: "bg-success/15 text-success",
  };
  return (
    <li className="relative">
      <span
        className={`absolute -left-[26px] grid h-6 w-6 place-items-center rounded-full ring-4 ring-background ${tones[tone]}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="text-xs font-semibold text-foreground">{title}</div>
      <div className="text-[11px] text-muted-foreground">{meta}</div>
    </li>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">{title}</div>
      <ul className="space-y-1.5 text-xs text-muted-foreground">
        {items.map((it) => (
          <li key={it}>
            <a href="#" className="hover:text-primary">
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
