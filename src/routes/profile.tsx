import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import CheckinPanel from "@/components/checkin/CheckinPanel";
import { useFavorites } from "@/hooks/use-favorites";
import { usePeriod } from "@/hooks/use-period";
import { useAuth } from "@/hooks/use-auth";
import {
  commonIssues,
  gentleStretches,
  dailyHabits,
  disclaimerText,
} from "@/data/knowledge";
import { Heart, Info, FileText, ChevronRight, Sun, Flower2, LogOut, Loader2, LogIn } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import emptyLazy from "@/assets/empty-lazy.jpg";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "我的 — 觉体BodyAwake" },
      { name: "description", content: "管理你的收藏、查看日常养护小贴士。" },
      { property: "og:title", content: "我的 — 觉体BodyAwake" },
      { property: "og:description", content: "管理你的收藏、查看日常养护小贴士。" },
    ],
  }),
  component: ProfilePage,
});

interface FavRow {
  key: string;
  type: "issue" | "stretch";
  id: string;
  name: string;
}

function PeriodSection() {
  const { data, isInPeriod, save, clear } = usePeriod();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    data ? new Date(data.startDate + "T12:00:00") : undefined
  );
  const [duration, setDuration] = useState(data?.duration ?? 5);

  const handleSave = () => {
    if (!date) return;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    save(`${y}-${m}-${d}`, duration);
    setOpen(false);
  };

  const fmt = (iso: string) => {
    const [, m, d] = iso.split("-");
    return `${Number(m)}月${Number(d)}日`;
  };

  return (
    <section className="px-5 pt-4">
      <div className="rounded-3xl bg-white shadow-soft overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-content-center rounded-full bg-rose-soft">
              <Flower2 className="h-4 w-4 text-accent" strokeWidth={1.8} />
            </span>
            <span className="text-[15px] text-foreground">经期记录</span>
          </div>
          {isInPeriod && (
            <span className="rounded-full bg-rose-soft px-2 py-0.5 text-[11px] text-accent">经期中</span>
          )}
        </div>

        <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-3">
          {data && (
            <p className="text-[13px] text-ink-soft">
              本次经期：{fmt(data.startDate)} 起，共 {data.duration} 天
            </p>
          )}

          <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-2xl text-[13px]">
                  {date
                    ? `${date.getMonth() + 1}月${date.getDate()}日`
                    : "选择开始日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => setDuration((n) => Math.max(1, n - 1))}
                className="grid h-7 w-7 place-content-center rounded-full bg-rose-soft text-accent text-base"
              >−</button>
              <span className="w-8 text-center text-[13px] text-foreground">{duration}天</span>
              <button
                onClick={() => setDuration((n) => Math.min(10, n + 1))}
                className="grid h-7 w-7 place-content-center rounded-full bg-rose-soft text-accent text-base"
              >+</button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-2xl bg-accent text-white text-[13px] hover:bg-accent/90"
              onClick={handleSave}
              disabled={!date}
            >
              保存
            </Button>
            {data && (
              <Button
                size="sm"
                variant="ghost"
                className="rounded-2xl text-[13px] text-muted-foreground"
                onClick={clear}
              >
                清除
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function GuestProfile() {
  return (
    <AppShell>
      <PageHeader title="我的" />
      <section className="px-5 pt-4">
        <div className="rounded-3xl bg-white p-6 text-center shadow-soft">
          <div className="mx-auto grid h-16 w-16 place-content-center rounded-full bg-sage-soft text-3xl">
            🌿
          </div>
          <h2 className="mt-4 text-[17px] font-semibold text-foreground">还没有登录</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
            登录后可以收藏喜欢的内容、记录经期和日常养护，温柔陪伴你认识身体。
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              to="/login"
              search={{ redirect: "/profile" }}
              className="flex h-11 items-center justify-center rounded-2xl bg-primary text-[14px] text-primary-foreground shadow-soft active:opacity-90"
            >
              <LogIn className="mr-1.5 h-4 w-4" strokeWidth={1.8} />
              登录
            </Link>
            <Link
              to="/signup"
              className="flex h-11 items-center justify-center rounded-2xl border border-border/70 bg-white text-[14px] text-foreground active:bg-sage-soft/40"
            >
              注册
            </Link>
          </div>
        </div>
      </section>

      {/* 日常养护（即使未登录也可以看） */}
      <section className="px-5 pt-4">
        <h2 className="mb-2 px-1 text-[13px] text-muted-foreground">日常温柔养护</h2>
        <ul className="space-y-2.5">
          {dailyHabits.slice(0, 3).map((h) => (
            <li key={h.id} className="rounded-3xl bg-white p-4 shadow-soft">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-content-center rounded-full bg-sage-soft">
                  <Sun className="h-3.5 w-3.5 text-sage-deep" strokeWidth={1.8} />
                </span>
                <p className="text-[14px] font-semibold text-foreground">{h.name}</p>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{h.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 py-4">
        <div className="rounded-3xl bg-sage-soft/60 p-4">
          <p className="text-xs font-medium text-sage-deep">📌 免责声明</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{disclaimerText}</p>
        </div>
      </section>
    </AppShell>
  );
}

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { ids } = useFavorites();
  const [signingOut, setSigningOut] = useState(false);

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink-soft" />
        </div>
      </AppShell>
    );
  }

  if (!user) return <GuestProfile />;

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    navigate({ to: "/login", search: { redirect: "/profile" } });
  };

  const favs: FavRow[] = ids
    .map<FavRow | null>((key) => {
      const [type, id] = key.split(":");
      if (type === "issue") {
        const c = commonIssues.find((x) => x.id === id);
        return c ? { key, type, id, name: c.name } : null;
      }
      if (type === "stretch") {
        const s = gentleStretches.find((x) => x.id === id);
        return s ? { key, type, id, name: s.name } : null;
      }
      return null;
    })
    .filter((x): x is FavRow => x !== null);

  const displayName = user.email?.split("@")[0] ?? "温柔的你";

  return (
    <AppShell>
      <PageHeader title="我的" />

      {/* 用户卡片 */}
      <section className="px-5">
        <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft">
          <div className="grid h-14 w-14 place-content-center rounded-full bg-sage-soft text-2xl">
            🌿
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </section>

      <PeriodSection />
      <CheckinPanel />

      {/* 收藏 */}
      <section className="px-5 pt-4">
        <div className="rounded-3xl bg-white shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-content-center rounded-full bg-rose-soft">
                <Heart className="h-4 w-4 text-accent" strokeWidth={1.8} />
              </span>
              <span className="text-[15px] text-foreground">我的收藏</span>
            </div>
            <span className="text-xs text-muted-foreground">{favs.length}</span>
          </div>

          {favs.length === 0 ? (
            <div className="flex flex-col items-center px-4 pb-6 pt-2">
              <img
                src={emptyLazy}
                alt="空空如也"
                width={512}
                height={512}
                loading="lazy"
                className="h-32 w-32 object-contain opacity-90"
              />
              <p className="mt-2 text-center text-xs text-muted-foreground">
                还没有收藏哦，去
                <Link to="/body" className="mx-1 text-sage-deep underline-offset-2">
                  身体图谱
                </Link>
                里探索一下吧 🌱
              </p>
            </div>
          ) : (
            <ul className="border-t border-border/60">
              {favs.map((f) => (
                <li key={f.key}>
                  {f.type === "issue" ? (
                    <Link
                      to="/issue/$id"
                      params={{ id: f.id }}
                      className="flex items-center justify-between px-4 py-3 active:bg-sage-soft/40"
                    >
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-sage-soft px-1.5 py-0.5 text-[10px] text-sage-deep">
                          话题
                        </span>
                        <span className="text-sm text-foreground">{f.name}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-ink-soft" />
                    </Link>
                  ) : (
                    <Link
                      to="/stretch/$id"
                      params={{ id: f.id }}
                      className="flex items-center justify-between px-4 py-3 active:bg-sage-soft/40"
                    >
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-rose-soft px-1.5 py-0.5 text-[10px] text-accent">
                          拉伸
                        </span>
                        <span className="text-sm text-foreground">{f.name}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-ink-soft" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 日常养护 */}
      <section className="px-5 pt-4">
        <h2 className="mb-2 px-1 text-[13px] text-muted-foreground">日常温柔养护</h2>
        <ul className="space-y-2.5">
          {dailyHabits.slice(0, 3).map((h) => (
            <li key={h.id} className="rounded-3xl bg-white p-4 shadow-soft">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-content-center rounded-full bg-sage-soft">
                  <Sun className="h-3.5 w-3.5 text-sage-deep" strokeWidth={1.8} />
                </span>
                <p className="text-[14px] font-semibold text-foreground">{h.name}</p>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{h.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 设置组 */}
      <section className="px-5 pt-4">
        <ul className="rounded-3xl bg-white shadow-soft overflow-hidden divide-y divide-border/60">
          <li>
            <button className="flex w-full items-center justify-between px-4 py-3.5 active:bg-sage-soft/40">
              <span className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-content-center rounded-full bg-sage-soft">
                  <Info className="h-4 w-4 text-sage-deep" strokeWidth={1.8} />
                </span>
                <span className="text-[15px] text-foreground">关于觉体BodyAwake</span>
              </span>
              <ChevronRight className="h-4 w-4 text-ink-soft" />
            </button>
          </li>
          <li>
            <button className="flex w-full items-center justify-between px-4 py-3.5 active:bg-sage-soft/40">
              <span className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-content-center rounded-full bg-sage-soft">
                  <FileText className="h-4 w-4 text-sage-deep" strokeWidth={1.8} />
                </span>
                <span className="text-[15px] text-foreground">使用说明</span>
              </span>
              <ChevronRight className="h-4 w-4 text-ink-soft" />
            </button>
          </li>
        </ul>
      </section>

      {/* 免责声明 */}
      <section className="px-5 pt-4">
        <div className="rounded-3xl bg-sage-soft/60 p-4">
          <p className="text-xs font-medium text-sage-deep">📌 免责声明</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{disclaimerText}</p>
        </div>
      </section>

      {/* 退出登录 */}
      <section className="px-5 pb-4 pt-4">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          disabled={signingOut}
          className="h-12 w-full rounded-2xl bg-white text-[14px] text-accent shadow-soft hover:bg-rose-soft/30"
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <LogOut className="mr-1.5 h-4 w-4" strokeWidth={1.8} />
              退出登录
            </>
          )}
        </Button>
      </section>
    </AppShell>
  );
}
