import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, History, MessageCircle, Phone, Video } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import { Tabs } from "@/components/ui/section-tabs";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Lify — Команда" },
      { name: "description", content: "Ваши врачи, консультации и чаты." },
    ],
  }),
  component: TeamPage,
});

const doctors = [
  { name: "Иванов И.И.", spec: "Флеболог", initials: "ИИ" },
  { name: "Смирнова О.Н.", spec: "Кардиолог", initials: "СО" },
  { name: "Петрова А.К.", spec: "Терапевт", initials: "ПА" },
];

function TeamPage() {
  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Раздел</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Команда</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ваши врачи и общение с ними</p>
      </header>

      <Tabs
        tabs={[
          { id: "doctors", label: "Мои врачи", content: <DoctorsTab /> },
          { id: "consultations", label: "Консультации", content: <ConsultationsTab /> },
          { id: "chats", label: "Чаты", content: <ChatsTab /> },
          { id: "duty", label: "Дежурный врач", content: <DutyTab /> },
        ]}
      />
    </AppShell>
  );
}

function DoctorsTab() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((d) => (
        <article key={d.name} className="surface-card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full gradient-primary text-base font-bold text-primary-foreground">
              {d.initials}
            </div>
            <div>
              <div className="text-sm font-semibold">{d.name}</div>
              <div className="text-xs text-muted-foreground">{d.spec}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            <ActionBtn icon={MessageCircle} label="Чат" />
            <ActionBtn icon={CalendarPlus} label="Запись" />
            <ActionBtn icon={History} label="История" />
          </div>
        </article>
      ))}
    </div>
  );
}

function ConsultationsTab() {
  return (
    <div className="space-y-5">
      <section>
        <SectionTitle title="Будущие" />
        <div className="surface-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/40 text-accent-foreground">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Иванов И.И. · Флеболог</div>
                <div className="text-xs text-muted-foreground">Завтра, 14:00 · видео</div>
              </div>
            </div>
            <StatusBadge tone="primary">Запланировано</StatusBadge>
          </div>
        </div>
      </section>
      <section>
        <SectionTitle title="Прошедшие" />
        <div className="surface-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm font-medium">Смирнова О.Н. · 10.06.2026</div>
            <StatusBadge tone="success">Завершено</StatusBadge>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChatsTab() {
  return (
    <div className="space-y-2">
      {doctors.map((d) => (
        <button
          key={d.name}
          className="surface-card surface-card-hover flex w-full items-center gap-3 p-4 text-left"
        >
          <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {d.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{d.name}</div>
              <div className="text-[11px] text-muted-foreground">09:14</div>
            </div>
            <div className="truncate text-xs text-muted-foreground">
              Спасибо, получил результаты — посмотрю и напишу...
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function DutyTab() {
  return (
    <div className="surface-card relative overflow-hidden p-6 text-center">
      <div className="absolute inset-0 gradient-primary opacity-10" aria-hidden />
      <div className="relative">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]">
          <Phone className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-bold">Дежурный врач онлайн</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Свяжитесь со специалистом в течение минуты
        </p>
        <button className="mt-5 inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]">
          Начать консультацию сейчас
        </button>
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button className="flex flex-col items-center gap-1 rounded-lg bg-muted/60 py-2 text-[11px] font-medium text-foreground hover:bg-secondary">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </button>
  );
}
