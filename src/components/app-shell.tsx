import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, UserRound, Home, HeartPulse, Stethoscope, Users, Menu } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/health", label: "Здоровье", icon: HeartPulse },
  { to: "/treatment", label: "Лечение", icon: Stethoscope },
  { to: "/team", label: "Команда", icon: Users },
  { to: "/more", label: "Еще", icon: Menu },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-[var(--shadow-glow)]">
              <HeartPulse className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-tight text-gradient-primary">Lify</div>
              <div className="hidden text-[11px] font-medium text-muted-foreground sm:block">
                Персональная система здравоохранения
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Уведомления"
              className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-critical ring-2 ring-background" />
            </button>
            <button
              type="button"
              aria-label="Профиль"
              className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-foreground transition-colors hover:bg-secondary"
            >
              <UserRound className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Выход"
              className="hidden h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:grid"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-5 md:px-6 md:pb-10">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-5">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.4]" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
