import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** 认证页面统一外壳：温柔治愈风、移动端适配 */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-cream px-6 pb-10 pt-4">
        <Link
          to="/"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft active:bg-sage-soft/40"
          aria-label="返回"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
        </Link>

        <header className="mt-6">
          <div className="grid h-14 w-14 place-content-center rounded-2xl bg-sage-soft text-2xl shadow-soft">
            🌿
          </div>
          <h1 className="mt-5 text-[26px] font-semibold leading-snug text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{subtitle}</p>
          )}
        </header>

        <main className="mt-7">{children}</main>

        {footer && <footer className="mt-6 text-center text-[13px] text-ink-soft">{footer}</footer>}
      </div>
    </div>
  );
}
