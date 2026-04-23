import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { findIssue, type CommonIssue } from "@/data/knowledge";
import { useFavorites } from "@/hooks/use-favorites";
import { useChecklist } from "@/hooks/use-checklist";
import { useAuth } from "@/hooks/use-auth";
import {
  Heart,
  ChevronLeft,
  Search,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import heroStretch from "@/assets/hero-stretch.jpg";

export const Route = createFileRoute("/issue/$id")({
  head: ({ params }) => {
    const c = findIssue(params.id);
    const title = c ? `${c.name} — 觉体BodyAwake` : "话题 — 觉体BodyAwake";
    const description = c?.empathy ?? "查看常见话题与温柔引导";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: ({ params }): { issue: CommonIssue } => {
    const c = findIssue(params.id);
    if (!c) throw notFound();
    return { issue: c };
  },
  notFoundComponent: () => (
    <AppShell hideTabBar>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-base text-foreground">没有找到这个话题</p>
        <Link
          to="/"
          className="mt-4 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          回到首页
        </Link>
      </div>
    </AppShell>
  ),
  component: IssuePage,
});

function IssuePage() {
  const data = Route.useLoaderData() as { issue: CommonIssue };
  const c = data.issue;
  const { has, toggle } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { checked, toggle: toggleCheck } = useChecklist(
    `issue:${c.id}`,
    c.gentleSolution.steps.length,
  );
  const isFav = has(`issue:${c.id}`);
  const doneCount = checked.filter(Boolean).length;
  const handleFav = () => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: `/issue/${c.id}` } });
      return;
    }
    toggle(`issue:${c.id}`);
  };

  return (
    <AppShell hideTabBar>
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={heroStretch}
          alt={c.name}
          width={1024}
          height={576}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-cream" />
        <Link
          to="/"
          className="absolute left-4 top-12 grid h-9 w-9 place-content-center rounded-full bg-white/90 backdrop-blur shadow-soft"
          aria-label="返回"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </Link>
      </div>

      <article className="relative -mt-10 rounded-t-[28px] bg-cream px-5 pb-32 pt-6">
        <div className="flex flex-wrap gap-1.5">
          {c.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-sage-soft px-2.5 py-0.5 text-[11px] text-sage-deep"
            >
              {t}
            </span>
          ))}
        </div>
        <h1 className="mt-2 text-2xl font-semibold leading-tight text-foreground">{c.name}</h1>

        {/* 共情 */}
        <section className="mt-5 rounded-3xl bg-rose-soft/60 p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" strokeWidth={1.8} />
            <p className="text-[13.5px] leading-relaxed text-ink">{c.empathy}</p>
          </div>
        </section>

        {/* 科学解释 */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-soft">
          <h2 className="flex items-center gap-2 text-[14px] font-semibold text-foreground">
            <Search className="h-4 w-4 text-sage-deep" strokeWidth={1.8} /> 它到底是怎么回事
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{c.scienceCause}</p>
        </section>

        {/* 误区辟谣 */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-soft">
          <h2 className="flex items-center gap-2 text-[14px] font-semibold text-foreground">
            <Lightbulb className="h-4 w-4 text-accent" strokeWidth={1.8} /> 反焦虑辟谣
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{c.mythBusting}</p>
        </section>

        {/* 温柔练习 Checklist */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[14px] font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-sage-deep" strokeWidth={1.8} /> 温柔练习
            </h2>
            <span className="text-xs text-muted-foreground">
              {doneCount}/{c.gentleSolution.steps.length}
            </span>
          </div>
          <p className="mt-2 text-[12.5px] text-muted-foreground">{c.gentleSolution.description}</p>
          <ul className="mt-3 space-y-2">
            {c.gentleSolution.steps.map((item, idx) => {
              const done = checked[idx];
              return (
                <li key={idx}>
                  <button
                    onClick={() => toggleCheck(idx)}
                    className="flex w-full items-start gap-3 rounded-2xl bg-cream p-3 text-left active:scale-[0.99]"
                  >
                    <span
                      className={`mt-0.5 grid h-5 w-5 flex-shrink-0 place-content-center rounded-md border transition-all ${
                        done
                          ? "border-sage bg-primary text-primary-foreground"
                          : "border-border bg-white"
                      }`}
                    >
                      {done && <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />}
                    </span>
                    <span
                      className={`text-[13.5px] leading-relaxed ${
                        done ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 rounded-2xl bg-sage-soft/60 px-3 py-2.5">
            <p className="text-[12px] text-sage-deep">
              💡 找感觉：<span className="text-ink">{c.gentleSolution.feelingPoint}</span>
            </p>
          </div>
          <div className="mt-2 flex items-start gap-2 rounded-2xl bg-rose-soft/50 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" strokeWidth={2} />
            <p className="text-[12px] leading-relaxed text-ink">
              {c.gentleSolution.compensationWarning}
            </p>
          </div>
        </section>

        {/* 温馨提示 */}
        <section className="mt-3 rounded-3xl bg-sage-soft/70 p-4">
          <p className="text-xs font-medium text-sage-deep">💚 写给你</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{c.affirmation}</p>
        </section>
      </article>

      {/* 底部悬浮操作栏 */}
      <div
        className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-border/60 bg-background/95 backdrop-blur-xl px-4 py-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleFav}
            className="grid h-12 w-12 flex-shrink-0 place-content-center rounded-2xl bg-rose-soft transition-transform active:scale-95"
            aria-label={isFav ? "取消收藏" : "收藏"}
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                isFav ? "fill-accent text-accent" : "text-accent"
              }`}
              strokeWidth={1.8}
            />
          </button>
          <Link
            to="/rehab"
            className="grid h-12 flex-1 place-content-center rounded-2xl bg-primary text-[15px] font-medium text-primary-foreground shadow-soft active:bg-sage-deep"
          >
            看看温柔拉伸
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
