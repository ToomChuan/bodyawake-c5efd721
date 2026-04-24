import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  bodyParts,
  commonIssues,
  findBodyPart,
  type BodyPartId,
} from "@/data/knowledge";
import { ChevronRight, Sparkles } from "lucide-react";
import bodyFront from "@/assets/body-front.jpg";
import bodyBack from "@/assets/body-back.jpg";

export const Route = createFileRoute("/body")({
  head: () => ({
    meta: [
      { title: "人体图谱 — 觉体BodyAwake" },
      { name: "description", content: "点击身体部位，了解女性身体的常见科普与温柔引导。" },
      { property: "og:title", content: "人体图谱 — 觉体BodyAwake" },
      {
        property: "og:description",
        content: "点击身体部位，了解女性身体的常见科普与温柔引导。",
      },
    ],
  }),
  component: BodyPage,
});

interface Hotspot {
  part: BodyPartId;
  top: string;
  left: string;
}

const frontHotspots: Hotspot[] = [
  { part: "neck",     top: "28%", left: "50%" },
  { part: "shoulder", top: "32%", left: "60%" },
  { part: "abdomen",  top: "44%", left: "50%" },
  { part: "thigh",    top: "63%", left: "43%" },
  { part: "calf",     top: "80%", left: "55%" },
];

const backHotspots: Hotspot[] = [
  { part: "neck",     top: "25%", left: "50%" },
  { part: "back",     top: "33%", left: "50%" },
  { part: "waist",    top: "43%", left: "50%" },
  { part: "hip",      top: "53%", left: "37%" },
  { part: "buttocks", top: "59%", left: "54%" },
];

function BodyPage() {
  const [side, setSide] = React.useState<"front" | "back">("front");
  const [activePart, setActivePart] = React.useState<BodyPartId | null>(null);

  const hotspots = side === "front" ? frontHotspots : backHotspots;
  const part = activePart ? findBodyPart(activePart) : undefined;

  // 根据部位中文名匹配 issue tags
  const partIssues = part
    ? commonIssues.filter((c) => c.tags.includes(part.name))
    : [];

  return (
    <AppShell>
      <PageHeader title="人体图谱" subtitle="点击身体上的小点，看看它在说什么" />

      {/* 正面/背面 切换 */}
      <div className="px-5">
        <div className="mx-auto inline-flex w-full max-w-[200px] items-center rounded-full bg-white p-1 shadow-soft">
          {(["front", "back"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={`flex-1 rounded-full py-1.5 text-sm transition-all ${
                side === s
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-ink-soft"
              }`}
            >
              {s === "front" ? "正面" : "背面"}
            </button>
          ))}
        </div>
      </div>

      {/* 人体插画 + 热区 */}
      <div className="relative mx-auto mt-4 aspect-[512/896] w-[78%] max-w-[320px]">
        <img
          src={side === "front" ? bodyFront : bodyBack}
          alt={side === "front" ? "人体正面图谱" : "人体背面图谱"}
          width={512}
          height={896}
          loading="lazy"
          className="h-full w-full object-fill"
        />
        {hotspots.map((h) => (
          <button
            key={`${side}-${h.part}`}
            onClick={() => setActivePart(h.part)}
            aria-label={`查看${findBodyPart(h.part)?.name ?? h.part}`}
            className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2"
            style={{ top: h.top, left: h.left }}
          >
            <span className="absolute inset-0 rounded-full bg-accent/50 animate-breathe" />
            <span className="absolute inset-1.5 grid place-content-center rounded-full bg-accent shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </button>
        ))}
      </div>

      <p className="mx-auto mt-4 max-w-[260px] px-5 text-center text-xs text-muted-foreground">
        💡 粉色小点是常见关注部位，轻轻点一下试试
      </p>

      {/* 全部部位列表（兜底入口） */}
      <section className="px-5 pt-6">
        <h2 className="mb-2 text-[13px] text-muted-foreground">所有部位</h2>
        <div className="grid grid-cols-3 gap-2">
          {bodyParts.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePart(p.id)}
              className="rounded-2xl bg-white py-2.5 text-sm text-foreground shadow-soft active:bg-sage-soft/40"
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {/* 底部半屏弹窗 */}
      <Drawer open={!!activePart} onOpenChange={(o) => !o && setActivePart(null)}>
        <DrawerContent className="bg-cream">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl">{part?.name ?? ""}</DrawerTitle>
            <DrawerDescription>{part?.femaleSpecificFeatures}</DrawerDescription>
          </DrawerHeader>

          {/* 抚慰话语 */}
          {part && (
            <div className="mx-4 rounded-2xl bg-sage-soft/70 p-3.5">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage-deep" strokeWidth={1.8} />
                <p className="text-[12.5px] leading-relaxed text-ink">
                  {part.comfortingMessage}
                </p>
              </div>
            </div>
          )}

          <div className="px-4 pb-2 pt-4">
            <p className="mb-2 text-[12px] text-muted-foreground">相关常见话题</p>
          </div>

          <ul className="space-y-2.5 px-4 pb-8">
            {partIssues.length === 0 && part && (
              <li className="rounded-2xl bg-white p-4 text-center text-sm text-muted-foreground shadow-soft">
                这个部位暂时没有专题，看看下面的小贴士吧 🌱
              </li>
            )}
            {partIssues.map((c) => (
              <li key={c.id}>
                <Link
                  to="/issue/$id"
                  params={{ id: c.id }}
                  onClick={() => setActivePart(null)}
                  className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-foreground">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {c.tags.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-ink-soft" />
                </Link>
              </li>
            ))}

            {/* 温柔小贴士 */}
            {part && part.gentleTips.length > 0 && (
              <li className="rounded-2xl bg-white p-4 shadow-soft">
                <p className="mb-2 text-[13px] font-medium text-foreground">日常小叮嘱</p>
                <ul className="space-y-1.5">
                  {part.gentleTips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-soft">
                      <span className="text-sage-deep">·</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </DrawerContent>
      </Drawer>
    </AppShell>
  );
}
