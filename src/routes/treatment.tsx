import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, FileText, Pill, Share2, Stethoscope, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatusBadge } from "@/components/ui/status";
import { Tabs } from "@/components/ui/section-tabs";
import { ShareDialog } from "@/components/share-dialog";
import type { ShareScope } from "@/lib/share-links-store";

export const Route = createFileRoute("/treatment")({
  head: () => ({
    meta: [
      { title: "Lify — Лечение" },
      { name: "description", content: "Все случаи лечения: активные, завершённые, архив." },
    ],
  }),
  component: TreatmentPage,
});

const cases = {
  active: [
    { name: "Варикоз", doctor: "Иванов И.И. · Флеболог", tone: "primary" as const, status: "Лечение" },
    { name: "Гипертония", doctor: "Смирнова О.Н. · Кардиолог", tone: "warning" as const, status: "Контроль" },
    { name: "Дефицит железа", doctor: "Терапевт", tone: "accent" as const, status: "Диагностика" },
  ],
  done: [
    { name: "ОРВИ", doctor: "Терапевт", tone: "success" as const, status: "Завершено" },
  ],
  archive: [
    { name: "Ангина", doctor: "Терапевт", tone: "default" as const, status: "Архив" },
  ],
};

function TreatmentPage() {
  const [share, setShare] = useState<{ scope: ShareScope; caseTitle?: string; context?: string } | null>(null);
  const onShare = (name: string) => setShare({ scope: "case", caseTitle: name, context: name });

  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Раздел</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Лечение</h1>
        <p className="mt-1 text-sm text-muted-foreground">Все ваши случаи в одном месте</p>
      </header>

      <Tabs
        tabs={[
          { id: "active", label: "Активные", content: <CasesList items={cases.active} detailed onShare={onShare} /> },
          { id: "done", label: "Завершённые", content: <CasesList items={cases.done} onShare={onShare} /> },
          { id: "archive", label: "Архив", content: <CasesList items={cases.archive} onShare={onShare} /> },
        ]}
      />

      <ShareDialog
        open={share !== null}
        onOpenChange={(o) => !o && setShare(null)}
        initialScope={share?.scope ?? "case"}
        caseTitle={share?.caseTitle}
        context={share?.context}
      />
    </AppShell>
  );
}

function CasesList({
  items,
  detailed,
}: {
  items: { name: string; doctor: string; tone: "primary" | "warning" | "accent" | "success" | "default"; status: string }[];
  detailed?: boolean;
}) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">Нет записей.</p>;
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <article key={c.name} className="surface-card surface-card-hover p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">{c.name}</h3>
                <div className="text-xs text-muted-foreground">{c.doctor}</div>
              </div>
            </div>
            <StatusBadge tone={c.tone}>{c.status}</StatusBadge>
          </div>

          {detailed && (
            <>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Mini icon={FileText} label="Анализы" value="4" />
                <Mini icon={Pill} label="Препараты" value="2" />
                <Mini icon={Users} label="Команда" value="2" />
              </div>
              <button className="mt-4 flex w-full items-center justify-between rounded-xl bg-muted px-4 py-2.5 text-sm font-medium hover:bg-secondary">
                Открыть случай <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </article>
      ))}
    </div>
  );
}

function Mini({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <div className="mt-1 text-base font-semibold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
