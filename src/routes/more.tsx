import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  CreditCard,
  Database,
  Download,
  FileText,
  FlaskConical,
  FolderArchive,
  HeartPulse,
  IdCard,
  Link as LinkIcon,
  Lock,
  MapPin,
  Phone,
  Search,
  Settings,
  Share2,
  Smartphone,
  Stethoscope,
  Syringe,
  User,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import { ShareDialog } from "@/components/share-dialog";
import type { ShareScope } from "@/lib/share-links-store";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "Lify — Ещё" },
      { name: "description", content: "Медицинский профиль, медкарта, специалисты, анализы, устройства, настройки и экспорт данных." },
    ],
  }),
  component: MorePage,
});

function MorePage() {
  const [share, setShare] = useState<{ scope: ShareScope; context?: string } | null>(null);

  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Раздел</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Ещё</h1>
        <p className="mt-1 text-sm text-muted-foreground">Медицинский профиль, архивы, настройки и экспорт</p>
      </header>

      <div className="space-y-6">
        <MedicalProfileCard />

        <Group title="Медицинский раздел">
          <Accordion title="Медкарта" icon={FileText} subtitle="Полная медицинская история">
            <Anamnesis />
          </Accordion>
          <Accordion title="Специалисты" icon={Stethoscope} subtitle="Маркетплейс врачей">
            <SpecialistsMarketplace />
          </Accordion>
          <Accordion title="Анализы" icon={FlaskConical} subtitle="Чекапы и каталог">
            <LabsMarketplace />
          </Accordion>
          <Accordion title="Обследования" icon={Activity} subtitle="УЗИ, МРТ, ЭКГ и др.">
            <SimpleList items={["УЗИ вен", "ЭКГ", "МРТ коленного сустава", "ФГДС", "УЗИ щитовидной железы"]} />
          </Accordion>
          <Accordion title="Файлы" icon={FolderArchive} subtitle="Заключения, выписки, снимки">
            <Files onShare={(s) => setShare(s)} />
          </Accordion>
        </Group>

        <Group title="Архив">
          <Accordion title="История обращений" icon={FolderArchive} subtitle="Все случаи и консультации">
            <SimpleList items={["Варикоз — 2026", "Гипертония — 2026", "Пневмония — 2024 (закрыто)"]} />
          </Accordion>
        </Group>

        <Group title="Система">
          <Accordion title="Устройства" icon={Smartphone} subtitle="Интеграции с носимыми">
            <Devices />
          </Accordion>
          <Accordion title="Настройки" icon={Settings} subtitle="Профиль, уведомления, приватность">
            <SettingsBlock />
          </Accordion>
          <Accordion title="Подписка" icon={CreditCard} subtitle="Тариф и оплата">
            <Subscription />
          </Accordion>
          <Accordion title="Экспорт данных" icon={Download} subtitle="Скачать копию своих данных">
            <ExportBlock onShare={(s) => setShare(s)} />
          </Accordion>
        </Group>
      </div>

      <ShareDialog
        open={share !== null}
        onOpenChange={(o) => !o && setShare(null)}
        initialScope={share?.scope ?? "full"}
        context={share?.context}
      />
    </AppShell>
  );
}

/* ───────── Медицинский профиль ───────── */

function MedicalProfileCard() {
  return (
    <section className="surface-card overflow-hidden">
      <div className="relative p-5">
        <div className="absolute inset-0 gradient-primary opacity-[0.08]" aria-hidden />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                <IdCard className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Паспорт здоровья</div>
                <div className="text-lg font-bold">Медицинский профиль</div>
              </div>
            </div>
            <StatusBadge tone="success">Прикреплён</StatusBadge>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Полис ОМС" value="№ XXXX XXXX XXXX 1234" />
            <Field label="СНИЛС" value="XXX-XXX-XXX 45" />
            <Field label="Поликлиника" value="Городская поликлиника №12" />
            <Field label="Участковый врач" value="Иванов И.И. · Терапевт" />
            <Field label="Регистратура" value="+7 (XXX) XXX-XX-XX" icon={Phone} />
            <Field label="Адрес обслуживания" value="г. Москва, ул. Примерная 12" icon={MapPin} />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted">Изменить</button>
            <button className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted">Скачать</button>
            <button className="rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
              Экстренная карточка
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-primary" />} {value}
      </div>
    </div>
  );
}

/* ───────── group + accordion ───────── */

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <SectionTitle title={title} />
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Accordion({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="surface-card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-muted/40">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">{title}</div>
            {subtitle && <div className="text-[11px] text-muted-foreground">{subtitle}</div>}
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-border bg-muted/20 p-5">{children}</div>}
    </div>
  );
}

function SimpleList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-foreground/85">
      {items.map((i) => <li key={i} className="flex items-start gap-2">• <span>{i}</span></li>)}
    </ul>
  );
}

/* ───────── Медкарта / Анамнез ───────── */

function Anamnesis() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Возраст" value="38" />
        <Stat label="Пол" value="М" />
        <Stat label="Рост" value="182 см" />
        <Stat label="Вес" value="89 кг" />
      </div>

      <SubBlock title="Хронические заболевания">
        <Chips items={["Варикоз", "Гипертония"]} tone="warning" />
      </SubBlock>
      <SubBlock title="Перенесённые">
        <Chips items={["Пневмония (2024)", "COVID-19 (2022)"]} tone="default" />
      </SubBlock>
      <SubBlock title="Аллергии">
        <Chips items={["Пенициллин", "Орехи"]} tone="critical" />
      </SubBlock>
      <SubBlock title="Госпитализации">
        <SimpleList items={["2024 · Городская больница №15 · Аппендэктомия"]} />
      </SubBlock>
      <SubBlock title="Вакцинации">
        <Chips items={["COVID-19", "Грипп", "Столбняк"]} tone="success" />
      </SubBlock>
      <SubBlock title="Текущие препараты">
        <SimpleList items={["Детралекс — текущий курс"]} />
      </SubBlock>
      <SubBlock title="Завершённые курсы">
        <SimpleList items={["Препарат железа — курс завершён"]} />
      </SubBlock>
      <SubBlock title="Диагнозы (МКБ)">
        <SimpleList items={["I83 — Варикозное расширение вен", "I10 — Артериальная гипертензия"]} />
      </SubBlock>
      <SubBlock title="Семейная история">
        <SimpleList items={["Отец — гипертония", "Мать — сахарный диабет"]} />
      </SubBlock>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

function SubBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function Chips({ items, tone }: { items: string[]; tone: "default" | "warning" | "critical" | "success" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => <StatusBadge key={i} tone={tone}>{i}</StatusBadge>)}
    </div>
  );
}

/* ───────── Файлы ───────── */

function Files({ onShare }: { onShare: (s: { scope: ShareScope; context?: string }) => void }) {
  const files = [
    { name: "УЗИ вен.pdf", date: "15.04.2027", cat: "Обследования" },
    { name: "МРТ колена.pdf", date: "22.06.2027", cat: "Обследования" },
    { name: "Анализ крови.pdf", date: "01.07.2027", cat: "Анализы" },
    { name: "Заключение терапевта.pdf", date: "02.05.2027", cat: "Заключения" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["Все", "Анализы", "Обследования", "Заключения", "Выписки", "Изображения"].map((c, i) => (
          <button key={c} className={`rounded-xl px-3 py-1.5 text-xs font-medium ${i === 0 ? "gradient-primary text-primary-foreground" : "border border-border bg-card"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {files.map((f) => (
          <div key={f.name} className="surface-card flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.name}</div>
                <div className="text-[11px] text-muted-foreground">{f.cat} · {f.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted">
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => onShare({ scope: "documents", context: f.name })}
                className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full rounded-xl border border-dashed border-border bg-muted/40 py-3 text-sm font-medium text-primary hover:bg-muted">
        Загрузить файл
      </button>
    </div>
  );
}

/* ───────── Специалисты (маркетплейс) ───────── */

function SpecialistsMarketplace() {
  const specs = ["Терапевт", "Кардиолог", "Эндокринолог", "Гастроэнтеролог", "Дерматолог", "Уролог", "Невролог", "Психотерапевт", "Хирург", "Флеболог"];
  return (
    <div className="space-y-4">
      <div className="surface-card flex items-center gap-2 p-2">
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <input className="flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground" placeholder="Поиск врача" />
      </div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {specs.map((s) => (
          <button key={s} className="whitespace-nowrap rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted">{s}</button>
        ))}
      </div>
      <div className="surface-card p-4">
        <div className="text-sm font-semibold">Анна Иванова</div>
        <div className="text-xs text-muted-foreground">Кардиолог · 12 лет опыта</div>
        <div className="mt-2 text-xs">Ближайшее время: <span className="font-semibold">Сегодня 19:30</span></div>
        <button className="mt-3 w-full rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
          Записаться
        </button>
      </div>
    </div>
  );
}

/* ───────── Анализы (маркетплейс) ───────── */

function LabsMarketplace() {
  const checkups = ["Ежегодный", "Мужской", "Женский", "Сердце и сосуды", "Щитовидная железа", "Спортивный"];
  return (
    <div className="space-y-4">
      <SubBlock title="Чекапы">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {checkups.map((c) => (
            <button key={c} className="surface-card surface-card-hover p-3 text-left">
              <div className="text-sm font-semibold">{c}</div>
              <div className="text-[11px] text-muted-foreground">Чекап</div>
            </button>
          ))}
        </div>
      </SubBlock>

      <SubBlock title="Рекомендовано вам">
        <div className="space-y-2">
          {["Ферритин", "Липидограмма", "Витамин D"].map((t) => (
            <div key={t} className="surface-card flex items-center justify-between gap-3 p-3">
              <div className="text-sm">{t}</div>
              <button className="rounded-xl gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
                Заказать
              </button>
            </div>
          ))}
        </div>
      </SubBlock>
    </div>
  );
}

/* ───────── Устройства ───────── */

function Devices() {
  const list = [
    { name: "Apple Health", connected: true },
    { name: "Garmin", connected: true },
    { name: "Huawei Health", connected: false },
    { name: "Fitbit", connected: false },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {list.map((d) => (
          <div key={d.name} className="surface-card surface-card-hover p-3 text-center">
            <Smartphone className="mx-auto h-5 w-5 text-primary" />
            <div className="mt-2 text-sm font-semibold">{d.name}</div>
            <div className="mt-1">
              <StatusBadge tone={d.connected ? "success" : "default"}>
                {d.connected ? "Подключено" : "Не подключено"}
              </StatusBadge>
            </div>
          </div>
        ))}
      </div>
      <SubBlock title="Какие данные поступают">
        <Chips items={["Пульс", "Вес", "Артериальное давление", "Сон", "Шаги"]} tone="default" />
      </SubBlock>
    </div>
  );
}

/* ───────── Настройки ───────── */

function SettingsBlock() {
  return (
    <div className="space-y-4">
      <SubBlock title="Профиль">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Имя" value="Алексей" />
          <Stat label="Дата рождения" value="12.04.1987" />
          <Stat label="Пол" value="М" />
        </div>
      </SubBlock>
      <SubBlock title="Уведомления">
        <div className="space-y-2">
          {["Напоминания", "Анализы", "Консультации", "Препараты"].map((n) => (
            <div key={n} className="surface-card flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-primary" />
                <div className="text-sm">{n}</div>
              </div>
              <div className="h-5 w-9 rounded-full bg-primary/80">
                <div className="ml-auto mt-0.5 mr-0.5 h-4 w-4 rounded-full bg-card" />
              </div>
            </div>
          ))}
        </div>
      </SubBlock>
      <SubBlock title="Конфиденциальность">
        <div className="space-y-2">
          {[
            { label: "Кто имеет доступ", icon: User },
            { label: "Передача врачу", icon: Stethoscope },
            { label: "История доступов", icon: Lock },
          ].map((r) => (
            <button key={r.label} className="surface-card surface-card-hover flex w-full items-center justify-between gap-3 p-3 text-left">
              <div className="flex items-center gap-3">
                <r.icon className="h-4 w-4 text-primary" />
                <div className="text-sm">{r.label}</div>
              </div>
              <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground" />
            </button>
          ))}
        </div>
      </SubBlock>
    </div>
  );
}

/* ───────── Подписка ───────── */

function Subscription() {
  return (
    <div className="space-y-4">
      <div className="surface-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Текущий тариф</div>
            <div className="mt-1 text-lg font-bold">Lify Plus</div>
          </div>
          <StatusBadge tone="primary">Активен</StatusBadge>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">Следующее списание: 22.07.2026 · 1 490 ₽/мес</div>
      </div>
      <SubBlock title="История платежей">
        <SimpleList items={["22.06.2026 — 1 490 ₽", "22.05.2026 — 1 490 ₽", "22.04.2026 — 1 490 ₽"]} />
      </SubBlock>
    </div>
  );
}

/* ───────── Экспорт ───────── */

function ExportBlock({ onShare }: { onShare: (s: { scope: ShareScope; context?: string }) => void }) {
  const exports = [
    { label: "Медкарта", format: "PDF" },
    { label: "Все анализы", format: "ZIP" },
    { label: "История обращений", format: "PDF" },
    { label: "Полный архив здоровья", format: "JSON / ZIP" },
  ];
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Получите копию своих медицинских данных.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {exports.map((e) => (
          <div key={e.label} className="surface-card flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">{e.label}</div>
                <div className="text-[11px] text-muted-foreground">{e.format}</div>
              </div>
            </div>
            <button className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <SubBlock title="Поделиться">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onShare({ scope: "full", context: "Передача врачу" })}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted"
          >
            Отправить врачу
          </button>
          <button className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted">
            Скачать
          </button>
          <button
            onClick={() => onShare({ scope: "temp", context: "Временная ссылка" })}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            <LinkIcon className="h-3.5 w-3.5" /> Сформировать ссылку
          </button>
        </div>
      </SubBlock>
    </div>
  );
}

// Suppress unused
export type _Unused = typeof HeartPulse | typeof Syringe;
