import { Link, useLocation } from "@tanstack/react-router";
import { Home, ScanFace, BookHeart, User } from "lucide-react";

const tabs = [
  { to: "/", label: "首页", icon: Home },
  { to: "/body", label: "图谱", icon: ScanFace },
  { to: "/rehab", label: "康复", icon: BookHeart },
  { to: "/profile", label: "我的", icon: User },
] as const;

export function TabBar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border/60 bg-background/90 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className="flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
              >
                <span
                  className={`grid h-9 w-9 place-content-center rounded-full transition-all ${
                    active ? "bg-primary text-primary-foreground shadow-soft" : "text-ink-soft"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.2 : 1.6} />
                </span>
                <span
                  className={`text-[11px] transition-colors ${
                    active ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
