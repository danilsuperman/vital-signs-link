import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Droplet,
  FileUp,
  FlaskConical,
  HeartPulse,
  Phone,
  Sparkles,
  Stethoscope,
  TriangleAlert,
  UserPlus,
  MessageSquare,
  Ambulance,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lify — Главная" },
      { name: "description", content: "Что происходит с вашим здоровьем сейчас: состояние, действия и активные случаи." },
    ],
  }),
  component: HomePage,
});

const activeCases = [
  { slug: "varikoz", title: "Варикоз", status: "Активное лечение", tone: "primary" as const },
  { slug: "gipertoniya", title: "Гипертония", status: "Контроль", tone: "warning" as const },
  { slug: "deficit-zheleza", title: "Дефицит железа", status: "Диагностика", tone: "accent" as const },
];

type ModalKey = null | "incident" | "doctor" | "emergency";

function HomePage() {
  const profileProgress = 64;
  const [modal, setModal] = useState<ModalKey>(null);
  const [symptoms, setSymptoms] = useState("");
  const close = () => setModal(null);

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Greeting */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Сегодня · 09:30
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Доброе утро, Алексей
            </h1>
          </div>
          <StatusBadge tone="success">Всё под контролем</StatusBadge>
        </div>

        {/* Блок 1.0 — Заполнение медкарты */}
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

        <div className="grid gap-4 md:grid-cols-2">
          {/* Блок 2.0 — Сводка состояния */}
          <section className="surface-card surface-card-hover p-5">
            <SectionTitle title="Сводка состояния" />
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-success/15 text-success">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">Стабильно</div>
                <div className="text-xs text-muted-foreground">Обновлено сегодня в 09:30</div>
              </div>
            </div>
            <Link
              to="/health"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Подробнее <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          {/* Блок 0.1 — Ближайшая консультация */}
          <section className="surface-card surface-card-hover p-5">
            <SectionTitle title="Ближайшая консультация" />
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/40 text-accent-foreground">
                <CalendarClock className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">Иванов И.И. · Флеболог</div>
                <div className="text-xs text-muted-foreground">Завтра, 14:00 · видеоконсультация</div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-lg gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
                    Подключиться
                  </button>
                  <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                    Перенести
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Блок 3.0 — Следующее действие (hero) */}
        <section className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-[var(--shadow-lg)]">
          <div className="absolute inset-0 gradient-primary" aria-hidden />
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_top_right,white,transparent_60%)]" aria-hidden />
          <div className="relative p-6 text-primary-foreground">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-90">
              <Sparkles className="h-3.5 w-3.5" /> Следующий шаг
            </div>
            <h3 className="mt-2 text-2xl font-bold leading-tight">Сдать ферритин</h3>
            <p className="mt-1 text-sm opacity-90">
              Рекомендуется до <span className="font-semibold">15 июня</span> — для повторной оценки запасов железа.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-background px-4 py-2 text-sm font-semibold text-primary shadow-[var(--shadow-md)] transition-transform hover:scale-[1.02]">
                Выполнить <ArrowRight className="h-4 w-4" />
              </button>
              <button className="rounded-lg bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/20">
                Отложить
              </button>
            </div>
          </div>
        </section>

        {/* Блок 4.0 — Активные случаи */}
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeCases.map((c) => (
              <Link
                key={c.slug}
                to="/treatment"
                className="surface-card surface-card-hover group p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <StatusBadge tone={c.tone}>{c.status}</StatusBadge>
                </div>
                <div className="mt-3 text-base font-semibold text-foreground">{c.title}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Открыть случай <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Блок 0.2 — Быстрые действия */}
        <section>
          <SectionTitle title="Быстрые действия" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <QuickAction
              icon={TriangleAlert}
              label="Что случилось?"
              tone="warning"
              onClick={() => setModal("incident")}
            />
            <QuickAction
              icon={UserPlus}
              label="Нужен врач"
              tone="primary"
              onClick={() => setModal("doctor")}
            />
            <QuickAction icon={FileUp} label="Загрузить документ" tone="accent" />
            <QuickAction
              icon={Phone}
              label="Срочная помощь"
              tone="critical"
              onClick={() => setModal("emergency")}
            />
          </div>
        </section>

        {/* Блок 0.3 — Последние изменения */}
        <section className="surface-card p-5">
          <SectionTitle title="Последние изменения" hint="Сегодня" />
          <ol className="relative space-y-4 border-l border-border pl-4">
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
      </div>

      {/* === Что случилось? === */}
      <Dialog open={modal === "incident"} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-warning/20 text-warning-foreground">
                <TriangleAlert className="h-5 w-5" />
              </span>
              Что случилось?
            </DialogTitle>
            <DialogDescription>
              Опишите симптомы — система определит подходящего специалиста и срочность.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Например: тянущая боль в левой ноге, тяжесть к вечеру..."
            rows={5}
          />
          <DialogFooter>
            <Button variant="outline" onClick={close}>Отмена</Button>
            <Button
              onClick={() => {
                if (!symptoms.trim()) {
                  toast.error("Опишите, что вас беспокоит");
                  return;
                }
                toast.success("Жалоба отправлена", {
                  description: "Дежурный терапевт ответит в течение 15 минут.",
                  icon: <CheckCircle2 className="h-4 w-4" />,
                });
                setSymptoms("");
                close();
              }}
            >
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Нужен врач === */}
      <Dialog open={modal === "doctor"} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-5 w-5" />
              </span>
              Нужен врач
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
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-critical/15 text-critical">
                <Ambulance className="h-5 w-5" />
              </span>
              Срочная помощь
            </DialogTitle>
            <DialogDescription>
              Если есть угроза жизни — звоните 112. Ниже — быстрый доступ к экстренным службам.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <a
              href="tel:112"
              className="surface-card surface-card-hover flex items-center gap-3 p-3"
              onClick={close}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-critical text-white">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground">112 — Единая служба</div>
                <div className="text-xs text-muted-foreground">Скорая, МЧС, полиция</div>
              </div>
            </a>
            <a
              href="tel:103"
              className="surface-card surface-card-hover flex items-center gap-3 p-3"
              onClick={close}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-critical/15 text-critical">
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
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
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
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
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
      <Link
        to={to}
        onClick={onClick}
        className="surface-card surface-card-hover flex items-center gap-3 p-3"
      >
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

function QuickAction({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone: "primary" | "warning" | "accent" | "critical";
  onClick?: () => void;
}) {
  const tones: Record<typeof tone, string> = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/20 text-warning-foreground",
    accent: "bg-accent/40 text-accent-foreground",
    critical: "bg-critical/15 text-critical",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="surface-card surface-card-hover flex flex-col items-start gap-3 p-4 text-left"
    >
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-semibold text-foreground">{label}</span>
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
      <span className={`absolute -left-[26px] grid h-6 w-6 place-items-center rounded-full ring-4 ring-background ${tones[tone]}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground">{meta}</div>
    </li>
  );
}
