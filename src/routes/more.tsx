import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ChevronRight,
  FileText,
  FlaskConical,
  FolderArchive,
  HeartPulse,
  Settings,
  Smartphone,
  Syringe,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle } from "@/components/ui/status";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "Lify — Еще" },
      { name: "description", content: "Медкарта, анализы, обследования, файлы, устройства, настройки." },
    ],
  }),
  component: MorePage,
});

const groups = [
  {
    title: "Медкарта",
    items: [
      { label: "Анамнез", icon: FileText },
      { label: "Диагнозы", icon: HeartPulse },
      { label: "Аллергии", icon: Activity },
      { label: "Операции", icon: Syringe },
      { label: "Госпитализации", icon: FolderArchive },
      { label: "Вакцинации", icon: Syringe },
      { label: "Семейная история", icon: FileText },
    ],
  },
  {
    title: "Архивы",
    items: [
      { label: "Анализы", icon: FlaskConical },
      { label: "Обследования", icon: Activity },
      { label: "Файлы", icon: FolderArchive },
    ],
  },
  {
    title: "Система",
    items: [
      { label: "Устройства", icon: Smartphone },
      { label: "Настройки", icon: Settings },
    ],
  },
];

function MorePage() {
  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Раздел</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Еще</h1>
        <p className="mt-1 text-sm text-muted-foreground">Системные разделы и архивы</p>
      </header>

      <div className="space-y-6">
        {groups.map((g) => (
          <section key={g.title}>
            <SectionTitle title={g.title} />
            <div className="surface-card divide-y divide-border overflow-hidden">
              {g.items.map((it) => (
                <button
                  key={it.label}
                  type="button"
                  className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                      <it.icon className="h-[18px] w-[18px]" />
                    </div>
                    <span className="text-sm font-medium">{it.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        ))}

        <section>
          <SectionTitle title="Интеграции с устройствами" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Apple Health", "Garmin", "Oura", "Fitbit"].map((d) => (
              <div key={d} className="surface-card surface-card-hover p-4 text-center">
                <Smartphone className="mx-auto h-5 w-5 text-primary" />
                <div className="mt-2 text-sm font-semibold">{d}</div>
                <div className="text-[11px] text-muted-foreground">Подключить</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
