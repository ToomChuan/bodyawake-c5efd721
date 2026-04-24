import { useCallback, useEffect, useState } from "react";
import BadgeWall from "@/components/checkin/BadgeWall";
import CheckinButton from "@/components/checkin/CheckinButton";
import { getCheckinData, type CheckinData } from "@/api/checkinService";

const EMPTY_DATA: CheckinData = {
  current_streak: 0,
  unlocked_badges: [],
  last_checkin_date: null,
};

export default function CheckinPanel() {
  const [checkinData, setCheckinData] = useState<CheckinData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);

  // 统一刷新函数：初次加载与打卡成功后复用
  const refreshCheckinData = useCallback(async () => {
    try {
      const data = await getCheckinData();
      setCheckinData(data);
    } catch (error) {
      console.error("[Checkin Panel Error][refreshCheckinData]:", error);
      setCheckinData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCheckinData();
  }, [refreshCheckinData]);

  return (
    <section className="px-5 pt-4">
      <div className="rounded-3xl border border-[#D7E5D4] bg-gradient-to-b from-[#F8FCF7] to-[#FFF8FA] p-4 shadow-[0_14px_34px_rgba(164,184,158,0.12)]">
        <div className="mb-4 space-y-1">
          <h2 className="text-base font-semibold tracking-wide text-[#2E4A41]">每日轻量舒缓打卡</h2>
          <p className="text-xs leading-relaxed text-[#6E7F78]">
            不必完美，坚持一点点就很好。今天也给身体一份温柔回应。
          </p>
        </div>

        <div className="mb-5 flex justify-center">
          {/* 点击打卡成功后，自动刷新面板数据，徽章和连续天数实时更新 */}
          <CheckinButton onCheckedIn={refreshCheckinData} />
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[#E5DFE3] bg-[#FBF8FA] px-4 py-8 text-center text-sm text-[#85767D]">
            正在轻轻整理你的打卡记录...
          </div>
        ) : (
          <BadgeWall
            currentStreak={checkinData.current_streak}
            unlockedBadges={checkinData.unlocked_badges}
          />
        )}
      </div>
    </section>
  );
}
