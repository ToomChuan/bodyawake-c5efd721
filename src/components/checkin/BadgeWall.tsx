type BadgeItem = {
  id: string;
  title: string;
  days: number;
};

type BadgeWallProps = {
  currentStreak: number;
};

const BADGE_CATALOG: BadgeItem[] = [
  { id: "streak_1", title: "初次舒缓", days: 1 },
  { id: "streak_3", title: "3天舒缓", days: 3 },
  { id: "streak_7", title: "7天舒缓", days: 7 },
  { id: "streak_14", title: "14天舒缓", days: 14 },
  { id: "streak_30", title: "30天舒缓", days: 30 },
  { id: "streak_60", title: "60天舒缓", days: 60 },
  { id: "streak_100", title: "100天舒缓", days: 100 },
];

export default function BadgeWall({ currentStreak }: BadgeWallProps) {
  return (
    <section className=”w-full rounded-3xl border border-[#DDE8DA] bg-[#F6FAF5] p-5”>
      {/* 顶部文案保持”鼓励感”，避免紧张感 */}
      <h2 className=”text-lg font-semibold tracking-wide text-[#2E4A41]”>
        已连续舒缓 <span className=”text-[#9D7C8A]”>{currentStreak}</span> 天
      </h2>
      <p className=”mt-1 text-sm text-[#60756D]”>每一次轻柔练习，都是在和身体温柔合作。</p>

      <div className=”mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3”>
        {BADGE_CATALOG.map((badge) => {
          const unlocked = Number(currentStreak) >= Number(badge.days);

          return (
            <div
              key={badge.id}
              className={[
                "rounded-2xl border p-3 text-center transition-all duration-300",
                unlocked
                  ? "border-[#A8C3A1] bg-[#EEF6EC] text-[#28453C] shadow-[0_10px_22px_rgba(168,195,161,0.25)] hover:-translate-y-0.5"
                  : "border-[#D5D5D5] bg-[#EFEFEF] text-[#8D8D8D] opacity-30 grayscale",
              ].join(" ")}
            >
              <div className="text-xs font-medium">{badge.title}</div>
              <div className="mt-1 text-base font-semibold">{badge.days} 天</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
