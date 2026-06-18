import { useState, type ReactNode } from "react";

export function Tabs({
  tabs,
  initial,
}: {
  tabs: { id: string; label: string; content: ReactNode }[];
  initial?: string;
}) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div className="-mx-4 mb-5 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="inline-flex min-w-full gap-1 rounded-xl bg-muted p-1 md:min-w-0">
          {tabs.map((t) => {
            const isActive = t.id === current.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-background text-foreground shadow-[var(--shadow-sm)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="animate-fade-in">{current.content}</div>
    </div>
  );
}
