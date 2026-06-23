import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  LogOut,
  UserRound,
  Home,
  HeartPulse,
  Stethoscope,
  Users,
  Menu,
  Send,
  Youtube,
  Instagram,
  Music2,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/health", label: "Здоровье", icon: HeartPulse },
  { to: "/treatment", label: "Лечение", icon: Stethoscope },
  { to: "/team", label: "Команда", icon: Users },
  { to: "/more", label: "Еще", icon: Menu },
] as const;

export function PageNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="surface-card mb-5 flex items-center gap-1 overflow-x-auto p-1.5">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
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

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border pt-8">
      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary">
              <HeartPulse className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-gradient-primary">Лайф</span>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Персональная система здравоохранения
          </p>
          <div className="mt-4 space-y-1 text-[11px] text-muted-foreground">
            <div>Горбунов Данила</div>
            <div>Александрович</div>
            <div>ИНН: 381208688683</div>
          </div>
        </div>
        <FooterCol
          title="Для клиента"
          items={["Поддержка", "Вопросы и ответы", "Стоимость услуг", "Специалисты", "Анализ кожи", "Личный кабинет"]}
        />
        <FooterCol title="Для специалистов" items={["Регистрация", "Панель специалиста"]} />
        <FooterCol title="О нас" items={["Платформа Lify", "Полезный блог", "Контакты"]} />
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
            Lify в соцсетях
          </div>
          <div className="flex gap-2">
            {[Youtube, Send, Instagram, Music2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-4 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Lify. Все права защищены.
      </div>
    </footer>
  );
}

export function AppShell({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
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

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Уведомления"
              className="relative grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-critical ring-2 ring-background" />
            </button>
            <button
              type="button"
              aria-label="Профиль"
              className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-foreground transition-colors hover:bg-secondary"
            >
              <UserRound className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Выход"
              className="hidden h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:grid"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-5 md:px-6">
        <PageNav />
        {children}
        {!hideFooter && <SiteFooter />}
      </main>
    </div>
  );
}
