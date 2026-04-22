import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { commonIssues, gentleStretches, healthTips, periodStretches, GentleStretch } from "@/data/knowledge";
import { usePeriod } from "@/hooks/use-period";
import { ChevronRight, Sparkles, Quote } from "lucide-react";
import heroStretch from "@/assets/hero-stretch.jpg";
import heroNeck from "@/assets/hero-neck.jpg";
import heroPosture from "@/assets/hero-posture.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "觉体BodyAwake — 你的温柔身体陪伴" },
      {
        name: "description",
        content: "女性体态科普 · 反焦虑 · 温和引导。陪你认识身体、温柔生活。",
      },
      { property: "og:title", content: "觉体BodyAwake — 你的温柔身体陪伴" },
      {
        property: "og:description",
        content: "女性体态科普 · 反焦虑 · 温和引导。陪你认识身体、温柔生活。",
      },
    ],
  }),
  component: HomePage,
});

const carousel = [
  {
    img: heroStretch,
    title: "三分钟肩颈放松指南",
    subtitle: "下班路上也能做",
    stretchId: "neck-shoulder-relax",
  },
  {
    img: heroNeck,
    title: "正确发力，避免代偿",
    subtitle: "找对感觉，事半功倍",
    stretchId: "open-shoulder-back",
  },
  {
    img: heroPosture,
    title: "找回中立体态",
    subtitle: "骨盆与髋部的温柔放松",
    stretchId: "pelvis-hip-relax",
  },
];

const quickEntries = [
  { partName: "颈部", emoji: "🌿", part: "neck" as const },
  { partName: "肩部", emoji: "🍃", part: "shoulder" as const },
  { partName: "背部", emoji: "🌱", part: "back" as const },
  { partName: "腰部", emoji: "🌾", part: "waist" as const },
  { partName: "胯部", emoji: "🌷", part: "hip" as const },
];

function PeriodBanner({ stretches }: { stretches: GentleStretch[] }) {
  return (
    <section className="px-5 pb-2">
      <div className="rounded-3xl bg-gradient-to-br from-rose-soft to-rose-soft/50 p-4 shadow-soft">
        <p className="text-[13px] font-medium text-accent">🌸 经期温柔模式</p>
        <p className="mt-1 text-[12px] text-ink-soft">今天是你的经期，这些动作更适合你</p>
        <ul className="mt-3 space-y-2">
          {stretches.map((s) => (
            <li key={s.id}>
              <Link
                to="/stretch/$id"
                params={{ id: s.id }}
                className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2.5"
              >
                <span className="text-[13px] text-foreground">{s.name}</span>
                <ChevronRight className="h-3.5 w-3.5 text-ink-soft" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HomePage() {
  const { isInPeriod } = usePeriod();
  // 把"反焦虑辟谣"的 healthTips 放在 Feed 顶部当亮点
  const featuredTip = healthTips.find((t) => t.category === "反焦虑辟谣");
  const feedIssues = commonIssues.slice(0, 5);

  return (
    <AppShell>
      <header className="px-5 pb-3 pt-12">
        <p className="text-xs text-muted-foreground">Hi, 早安 ☁️</p>
        <h1 className="mt-1 text-[24px] font-semibold leading-snug text-foreground">
          今天身体感觉怎么样？
        </h1>
      </header>

      {isInPeriod && <PeriodBanner stretches={periodStretches} />}

      {/* 轮播卡片 */}
      <section className="overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3">
          {carousel.map((item) => {
            const exists = gentleStretches.some((s) => s.id === item.stretchId);
            return (
              <Link
                key={item.title}
                to="/stretch/$id"
                params={{ id: exists ? item.stretchId : gentleStretches[0].id }}
                className="relative h-40 w-64 flex-shrink-0 overflow-hidden rounded-3xl shadow-soft"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  width={1024}
                  height={576}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-base font-medium leading-snug">{item.title}</h3>
                  <p className="mt-0.5 text-xs opacity-90">{item.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 金刚区 */}
      <section className="px-5 pt-5">
        <div className="rounded-3xl bg-white p-4 shadow-soft">
          <ul className="flex justify-between">
            {quickEntries.map(({ part, partName, emoji }) => (
              <li key={part}>
                <Link
                  to="/body"
                  className="flex flex-col items-center gap-1.5"
                >
                  <span className="grid h-12 w-12 place-content-center rounded-full bg-sage-soft text-xl">
                    {emoji}
                  </span>
                  <span className="text-[11px] text-ink-soft">{partName}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 反焦虑亮点卡 */}
      {featuredTip && (
        <section className="px-5 pt-5">
          <div className="rounded-3xl bg-gradient-to-br from-rose-soft to-sage-soft/70 p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-accent" strokeWidth={1.8} />
              <span className="text-[11px] font-medium tracking-wide text-accent uppercase">
                反焦虑小卡
              </span>
            </div>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-foreground">
              {featuredTip.myth}
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
              {featuredTip.affirmation}
            </p>
          </div>
        </section>
      )}

      {/* 科普 Feed */}
      <section className="px-5 pb-6 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">今日小知识</h2>
          <Link to="/rehab" className="flex items-center text-xs text-muted-foreground">
            更多 <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ul className="space-y-3">
          {feedIssues.map((c) => (
            <li key={c.id}>
              <Link
                to="/issue/$id"
                params={{ id: c.id }}
                className="block rounded-3xl bg-white p-4 shadow-soft transition-transform active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-foreground">{c.name}</h3>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {c.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-sage-soft px-2 py-0.5 text-[10px] text-sage-deep"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="grid h-8 w-8 flex-shrink-0 place-content-center rounded-full bg-rose-soft">
                    <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.5} />
                  </span>
                </div>
                <blockquote className="mt-3 rounded-2xl bg-sage-soft/60 px-3 py-2.5 text-[12.5px] leading-relaxed text-ink">
                  <span className="text-sage-deep">「</span>
                  {c.affirmation}
                  <span className="text-sage-deep">」</span>
                </blockquote>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
