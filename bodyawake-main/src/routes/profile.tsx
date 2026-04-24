import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useFavorites } from "@/hooks/use-favorites";
import {
  commonIssues,
  gentleStretches,
  dailyHabits,
  disclaimerText,
} from "@/data/knowledge";
import { Heart, Info, FileText, ChevronRight, Sun } from "lucide-react";
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

function ProfilePage() {
  const { ids } = useFavorites();

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

  return (
    <AppShell>
      <PageHeader title="我的" />

      {/* 用户卡片 */}
      <section className="px-5">
        <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft">
          <div className="grid h-14 w-14 place-content-center rounded-full bg-sage-soft text-2xl">
            🌿
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">温柔的你</p>
            <p className="mt-0.5 text-xs text-muted-foreground">陪你一起认识身体</p>
          </div>
        </div>
      </section>

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
      <section className="px-5 py-4">
        <div className="rounded-3xl bg-sage-soft/60 p-4">
          <p className="text-xs font-medium text-sage-deep">📌 免责声明</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{disclaimerText}</p>
        </div>
      </section>
    </AppShell>
  );
}
