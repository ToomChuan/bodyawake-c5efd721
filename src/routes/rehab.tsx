import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { commonIssues, gentleStretches, healthTips } from "@/data/knowledge";
import { ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/rehab")({
  head: () => ({
    meta: [
      { title: "康复科普 — 觉体BodyAwake" },
      { name: "description", content: "常见话题、温柔拉伸、反焦虑辟谣，三类内容陪你了解身体。" },
      { property: "og:title", content: "康复科普 — 觉体BodyAwake" },
      {
        property: "og:description",
        content: "常见话题、温柔拉伸、反焦虑辟谣，三类内容陪你了解身体。",
      },
    ],
  }),
  component: RehabPage,
});

type Tab = "issues" | "stretches" | "myths";

const tabs: { key: Tab; label: string }[] = [
  { key: "issues", label: "常见话题" },
  { key: "stretches", label: "温柔拉伸" },
  { key: "myths", label: "反焦虑" },
];

function RehabPage() {
  const [active, setActive] = React.useState<Tab>("issues");

  return (
    <AppShell>
      <PageHeader title="康复科普" subtitle="选你需要的，慢慢看" />

      {/* Tab */}
      <div className="px-5">
        <div className="inline-flex w-full items-center rounded-2xl bg-white p-1 shadow-soft">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex-1 rounded-xl py-2 text-sm transition-all ${
                active === t.key
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-ink-soft"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 列表内容 */}
      <div className="px-5 pt-4">
        {active === "issues" && (
          <ul className="space-y-3">
            {commonIssues.map((c) => (
              <li key={c.id}>
                <Link
                  to="/issue/$id"
                  params={{ id: c.id }}
                  className="flex gap-3 rounded-3xl bg-white p-3 shadow-soft active:scale-[0.99]"
                >
                  <div className="grid h-20 w-20 flex-shrink-0 place-content-center rounded-2xl bg-gradient-to-br from-sage-soft to-rose-soft">
                    <span className="text-3xl">🌿</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
                    <div>
                      <h3 className="text-[15px] font-semibold text-foreground">{c.name}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {c.empathy}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11px] text-sage-deep">{c.tags[0]}</span>
                      <ChevronRight className="h-4 w-4 text-ink-soft" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {active === "stretches" && (
          <ul className="space-y-3">
            {gentleStretches.map((s) => (
              <li key={s.id}>
                <Link
                  to="/stretch/$id"
                  params={{ id: s.id }}
                  className="flex gap-3 rounded-3xl bg-white p-3 shadow-soft active:scale-[0.99]"
                >
                  <div className="grid h-20 w-20 flex-shrink-0 place-content-center rounded-2xl bg-gradient-to-br from-rose-soft to-sage-soft">
                    <span className="text-3xl">🌷</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
                    <div>
                      <h3 className="text-[15px] font-semibold text-foreground">{s.name}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {s.suitableFor}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11px] text-sage-deep">{s.duration}</span>
                      <ChevronRight className="h-4 w-4 text-ink-soft" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {active === "myths" && (
          <ul className="space-y-3">
            {healthTips.map((t) => (
              <li
                key={t.id}
                className="rounded-3xl bg-white p-4 shadow-soft"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.8} />
                  <span className="text-[11px] uppercase tracking-wide text-accent">
                    {t.category}
                  </span>
                </div>
                <p className="mt-2 text-[14px] font-semibold leading-snug text-foreground">
                  ❌ {t.myth}
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
                  ✅ {t.truth}
                </p>
                <blockquote className="mt-3 rounded-2xl bg-sage-soft/60 px-3 py-2.5 text-[12.5px] leading-relaxed text-ink">
                  <span className="text-sage-deep">「</span>
                  {t.affirmation}
                  <span className="text-sage-deep">」</span>
                </blockquote>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
