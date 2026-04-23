import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { findStretch, type GentleStretch } from "@/data/knowledge";
import { useFavorites } from "@/hooks/use-favorites";
import { useChecklist } from "@/hooks/use-checklist";
import { useAuth } from "@/hooks/use-auth";
import {
  Heart,
  ChevronLeft,
  Clock,
  Repeat,
  Target,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import heroStretch from "@/assets/hero-stretch.jpg";

export const Route = createFileRoute("/stretch/$id")({
  head: ({ params }) => {
    const s = findStretch(params.id);
    const title = s ? `${s.name} — 觉体BodyAwake` : "拉伸 — 觉体BodyAwake";
    const description = s?.suitableFor ?? "温柔的女性拉伸引导";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: ({ params }): { stretch: GentleStretch } => {
    const s = findStretch(params.id);
    if (!s) throw notFound();
    return { stretch: s };
  },
  notFoundComponent: () => (
    <AppShell hideTabBar>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-base text-foreground">没有找到这个拉伸</p>
        <Link
          to="/rehab"
          className="mt-4 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          看看其他拉伸
        </Link>
      </div>
    </AppShell>
  ),
  component: StretchPage,
});

function StretchPage() {
  const data = Route.useLoaderData() as { stretch: GentleStretch };
  const s = data.stretch;
  const { has, toggle } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { checked, toggle: toggleCheck } = useChecklist(
    `stretch:${s.id}`,
    s.steps.length,
  );
  const isFav = has(`stretch:${s.id}`);
  const doneCount = checked.filter(Boolean).length;
  const handleFav = () => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: `/stretch/${s.id}` } });
      return;
    }
    toggle(`stretch:${s.id}`);
  };

  return (
    <AppShell hideTabBar>
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={heroStretch}
          alt={s.name}
          width={1024}
          height={576}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-cream" />
        <Link
          to="/rehab"
          className="absolute left-4 top-12 grid h-9 w-9 place-content-center rounded-full bg-white/90 backdrop-blur shadow-soft"
          aria-label="返回"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </Link>
      </div>

      <article className="relative -mt-10 rounded-t-[28px] bg-cream px-5 pb-32 pt-6">
        <div className="flex flex-wrap gap-1.5">
          {s.targetArea.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full bg-sage-soft px-2.5 py-0.5 text-[11px] text-sage-deep"
            >
              {t}
            </span>
          ))}
        </div>
        <h1 className="mt-2 text-2xl font-semibold leading-tight text-foreground">{s.name}</h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">{s.suitableFor}</p>

        {/* Meta 卡 */}
        <section className="mt-5 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-white p-3 shadow-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.8} /> 时长
            </div>
            <p className="mt-1 text-[13px] text-foreground">{s.duration}</p>
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Repeat className="h-3.5 w-3.5" strokeWidth={1.8} /> 频率
            </div>
            <p className="mt-1 text-[13px] text-foreground">{s.frequency}</p>
          </div>
        </section>

        {/* 步骤 Checklist */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[14px] font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-sage-deep" strokeWidth={1.8} /> 跟着做
            </h2>
            <span className="text-xs text-muted-foreground">
              {doneCount}/{s.steps.length}
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {s.steps.map((item, idx) => {
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
                      <span className="text-sage-deep mr-1">{idx + 1}.</span>
                      {item}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 找感觉 */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-soft">
          <h2 className="flex items-center gap-2 text-[14px] font-semibold text-foreground">
            <Target className="h-4 w-4 text-sage-deep" strokeWidth={1.8} /> 找对感觉
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{s.feelingPoint}</p>
        </section>

        {/* 安全提醒 */}
        <section className="mt-3 rounded-3xl bg-rose-soft/50 p-4">
          <h2 className="flex items-center gap-2 text-[14px] font-semibold text-foreground">
            <AlertTriangle className="h-4 w-4 text-accent" strokeWidth={1.8} /> 避免代偿
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{s.compensationWarning}</p>
        </section>

        <section className="mt-3 rounded-3xl bg-sage-soft/70 p-4">
          <h2 className="flex items-center gap-2 text-[14px] font-semibold text-sage-deep">
            <ShieldCheck className="h-4 w-4" strokeWidth={1.8} /> 安全须知
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink">{s.safetyNotes}</p>
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
          <button className="h-12 flex-1 rounded-2xl bg-primary text-[15px] font-medium text-primary-foreground shadow-soft active:bg-sage-deep">
            开始练习
          </button>
        </div>
      </div>
    </AppShell>
  );
}
