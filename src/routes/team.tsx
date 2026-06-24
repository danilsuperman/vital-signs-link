import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  CalendarPlus,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  HeartPulse,
  MessageCircle,
  MessageSquare,
  Mic,
  Phone,
  Search,
  Send,
  Star,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import { Tabs } from "@/components/ui/section-tabs";
import doctorPhoto from "@/assets/doctor-petrov.jpg";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Lify — Команда" },
      { name: "description", content: "Ваша команда здоровья: специалисты, консультации, чаты по кейсам, дежурный врач." },
    ],
  }),
  component: TeamPage,
});

const MY_TEAM = [
  { name: "Иванов И.И.", role: "Терапевт", initials: "ИИ", caseLabel: "Координирует общее наблюдение", last: "12 июня", next: "Контроль" },
  { name: "Смирнова О.Н.", role: "Кардиолог", initials: "СО", caseLabel: "Ведёт: Повышенное давление", last: "2 июля", next: "Контроль давления" },
  { name: "Петров А.С.", role: "Флеболог", initials: "ПА", caseLabel: "Ведёт: Варикоз", last: "15 июня", next: "Контрольное УЗИ" },
  { name: "Орлова К.В.", role: "Дерматолог", initials: "ОК", caseLabel: "Ведёт: Акне", last: "5 мая", next: "Контроль" },
];

function TeamPage() {
  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Раздел</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Команда</h1>
        <p className="mt-1 text-sm text-muted-foreground">Кто помогает вам со здоровьем</p>
      </header>

      {/* Моя медицинская команда — поверх вкладок */}
      <section className="mb-5 surface-card overflow-hidden">
        <div className="relative p-5">
          <div className="absolute inset-0 gradient-primary opacity-[0.08]" aria-hidden />
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Ваша команда здоровья</div>
                <div className="mt-1 text-lg font-bold">Моя медицинская команда</div>
                <p className="mt-1 text-xs text-muted-foreground">Персональные специалисты, которые знают вашу историю</p>
              </div>
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MY_TEAM.map((d) => (
                <div key={d.name} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <img
                    src={doctorPhoto}
                    alt={d.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-2.5 text-center">
                    <div className="text-[11px] font-semibold leading-tight">Ваш {d.role.toLowerCase()}</div>
                    <div className="text-[11px] text-muted-foreground">{d.name}</div>
                    <div className="mt-2 grid gap-1.5">
                      <button className="rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] font-medium hover:bg-muted">
                        Написать
                      </button>
                      <button className="rounded-lg gradient-primary px-2 py-1.5 text-[11px] font-semibold text-primary-foreground">
                        Записаться
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Tabs
        tabs={[
          { id: "doctors", label: "Мои специалисты", content: <MyDoctorsTab /> },
          { id: "consultations", label: "Консультации", content: <ConsultationsTab /> },
          { id: "messages", label: "Сообщения", content: <MessagesTab /> },
          { id: "find", label: "Найти специалиста", content: <FindTab /> },
          { id: "duty", label: "Дежурный врач", content: <DutyTab /> },
        ]}
      />
    </AppShell>
  );
}

/* ───────── Мои специалисты ───────── */

function MyDoctorsTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Специалисты, которые участвуют в вашем лечении и наблюдении.</p>

      <section>
        <SectionTitle title="Активная команда" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MY_TEAM.map((d) => (
            <article key={d.name} className="surface-card p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-full gradient-primary text-base font-bold text-primary-foreground">
                  {d.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{d.role}</div>
                  <div className="text-xs text-muted-foreground">{d.name}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-foreground/85">
                <div>{d.caseLabel}</div>
                <div className="text-muted-foreground">Последняя консультация: {d.last}</div>
                <div className="text-muted-foreground">Следующее действие: {d.next}</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted">Написать</button>
                <button className="rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
                  Записаться
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="По случаям" hint="Кто отвечает за какую проблему" />
        <div className="space-y-3">
          <CaseTeamRow caseName="Варикоз" specialists={["Флеболог: Петров А.С."]} />
          <CaseTeamRow caseName="Повышенное давление" specialists={["Кардиолог: Смирнова О.Н.", "Терапевт: Иванов И.И."]} />
          <CaseTeamRow caseName="Акне" specialists={["Дерматолог: Орлова К.В."]} />
        </div>
      </section>
    </div>
  );
}

function CaseTeamRow({ caseName, specialists }: { caseName: string; specialists: string[] }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">{caseName}</div>
            <div className="text-[11px] text-muted-foreground">{specialists.length} специалист(а)</div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
      <ul className="mt-3 space-y-1 text-xs text-foreground/85">
        {specialists.map((s) => <li key={s}>• {s}</li>)}
      </ul>
    </div>
  );
}

/* ───────── Консультации ───────── */

const FUTURE_CONS = [
  { doctor: "Смирнова О.Н.", role: "Кардиолог", when: "15 августа, 14:00", type: "Онлайн", icon: Video },
  { doctor: "Петров А.С.", role: "Флеболог", when: "22 августа, 11:30", type: "Видео", icon: Video },
];

const PAST_CONS = [
  { doctor: "Петров А.С.", role: "Флеболог", when: "15 июня", status: "Заключение готово", case: "Варикоз #245" },
  { doctor: "Иванов И.И.", role: "Терапевт", when: "2 мая", status: "Заключение готово", case: "Общее наблюдение" },
];

function ConsultationsTab() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-5">
      <section>
        <SectionTitle title="Будущие" />
        <div className="space-y-3">
          {FUTURE_CONS.map((c) => (
            <div key={c.doctor + c.when} className="surface-card flex items-start justify-between gap-3 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/40 text-accent-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{c.doctor} · {c.role}</div>
                  <div className="text-xs text-muted-foreground">{c.when} · {c.type}</div>
                </div>
              </div>
              <StatusBadge tone="primary">Запланировано</StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Прошедшие" />
        <div className="space-y-3">
          {PAST_CONS.map((c) => {
            const isOpen = open === c.doctor + c.when;
            return (
              <div key={c.doctor + c.when} className="surface-card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : c.doctor + c.when)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-muted/40"
                >
                  <div>
                    <div className="text-sm font-semibold">{c.doctor} · {c.when}</div>
                    <div className="mt-1"><StatusBadge tone="success">{c.status}</StatusBadge></div>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="grid gap-3 border-t border-border bg-muted/30 p-4 text-sm sm:grid-cols-2">
                    <Detail title="Итог" text="Основные выводы врача и интерпретация анализов." />
                    <Detail title="Назначения" text="Компрессионная терапия, контрольное УЗИ через 3 месяца." />
                    <Detail title="Рекомендации" text="Контроль АД, режим, физическая активность." />
                    <Detail title="Связанный случай" text={c.case} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Detail({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-1 text-foreground/85">{text}</div>
    </div>
  );
}

/* ───────── Сообщения ───────── */

const CASE_CHATS = [
  { caseName: "Варикоз", participants: ["Флеболог", "Ассистент Lify"], last: "Спасибо, посмотрю результаты УЗИ", when: "09:14", unread: 1 },
  { caseName: "Повышенное давление", participants: ["Кардиолог", "Терапевт", "Ассистент Lify"], last: "Продолжайте контроль АД", when: "Вчера", unread: 0 },
  { caseName: "Общее здоровье", participants: ["Терапевт", "Ассистент Lify"], last: "Записал на ежегодный чекап", when: "12 июня", unread: 0 },
];

function MessagesTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Чаты привязаны к кейсам, а не к врачам. Врач может смениться — история останется.
      </p>
      <div className="space-y-2">
        {CASE_CHATS.map((c) => (
          <button
            key={c.caseName}
            className="surface-card surface-card-hover flex w-full items-start gap-3 p-4 text-left"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">{c.caseName}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{c.when}</span>
                  {c.unread > 0 && (
                    <span className="grid h-5 min-w-[20px] place-items-center rounded-full gradient-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground">{c.participants.join(" · ")}</div>
              <div className="mt-1 truncate text-xs text-foreground/85">{c.last}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────── Найти специалиста ───────── */

const SPECIALTIES = ["Терапевт", "Кардиолог", "Гастроэнтеролог", "Флеболог", "Дерматолог", "Уролог", "Эндокринолог", "Невролог", "Психотерапевт"];

const CATALOG = [
  { name: "Анна Иванова", role: "Кардиолог", years: 12, slot: "Сегодня 18:30", rating: 4.9, price: "от 3 500 ₽" },
  { name: "Михаил Орлов", role: "Терапевт", years: 18, slot: "Сегодня 20:00", rating: 4.8, price: "от 2 800 ₽" },
  { name: "Елена Соколова", role: "Эндокринолог", years: 9, slot: "Завтра 10:15", rating: 5.0, price: "от 4 200 ₽" },
];

function FindTab() {
  return (
    <div className="space-y-5">
      <section>
        <div className="surface-card flex items-center gap-2 p-2">
          <Search className="ml-2 h-4 w-4 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Поиск врача"
          />
          <button className="inline-flex items-center gap-1 rounded-xl bg-muted px-3 py-2 text-xs font-medium">
            <Filter className="h-3.5 w-3.5" /> Фильтры
          </button>
        </div>
      </section>

      <section>
        <SectionTitle title="Категории" />
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {SPECIALTIES.map((s) => (
            <button key={s} className="whitespace-nowrap rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted">
              {s}
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Доступны сейчас" />
        <div className="grid gap-3 md:grid-cols-2">
          {CATALOG.map((d) => (
            <article key={d.name} className="surface-card p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  {d.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold">{d.name}</div>
                    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-warning-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning" /> {d.rating}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{d.role} · стаж {d.years} лет</div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                    <span className="text-foreground/85">Ближайшее время: <span className="font-semibold">{d.slot}</span></span>
                    <span className="text-muted-foreground">{d.price}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-primary/5 p-2.5 text-[11px] text-foreground/80">
                Перед записью врач автоматически получит ваши диагнозы, анализы, препараты и аллергии.
              </div>
              <button className="mt-3 w-full rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
                Записаться
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ───────── Дежурный врач ───────── */

function DutyTab() {
  return (
    <div className="space-y-5">
      <section className="surface-card relative overflow-hidden p-6">
        <div className="absolute inset-0 gradient-primary opacity-10" aria-hidden />
        <div className="relative text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <Stethoscope className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold">Получите помощь врача прямо сейчас</h3>
          <p className="mt-1 text-sm text-muted-foreground">Дежурный специалист ответит в течение минуты</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <ChannelBtn icon={MessageCircle} label="Текст" />
            <ChannelBtn icon={Mic} label="Аудио" />
            <ChannelBtn icon={Video} label="Видео" />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Экстренный вопрос" hint="Выберите ситуацию — врач получит контекст немедленно" />
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Температура 39",
            "Сильная боль",
            "Травма",
            "Кровотечение",
          ].map((t) => (
            <button key={t} className="surface-card surface-card-hover flex items-center gap-3 p-4 text-left">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-critical/15 text-critical">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">{t}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="surface-card p-5">
        <SectionTitle title="Что получит врач" />
        <ul className="space-y-1.5 text-sm text-foreground/85">
          <li>• Текущие заболевания</li>
          <li>• Назначенные препараты</li>
          <li>• Аллергии</li>
          <li>• Последние анализы</li>
          <li>• Активные случаи</li>
        </ul>
      </section>
    </div>
  );
}

function ChannelBtn({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button className="rounded-xl border border-border bg-card py-3 text-xs font-semibold hover:bg-muted">
      <Icon className="mx-auto mb-1 h-4 w-4 text-primary" />
      {label}
    </button>
  );
}

// Suppress unused imports for symmetry
export type _Unused = typeof Phone | typeof CalendarPlus | typeof Clock | typeof FileText | typeof Send;
