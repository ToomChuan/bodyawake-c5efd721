import { useEffect, useMemo, useState } from "react";
import { getCheckinData, performCheckin } from "@/api/checkinService";

type CheckinStatus = "loading" | "idle" | "checked";

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

type CheckinButtonProps = {
  onCheckedIn?: () => void | Promise<void>;
};

export default function CheckinButton({ onCheckedIn }: CheckinButtonProps) {
  const [status, setStatus] = useState<CheckinStatus>("loading");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const checkin = await getCheckinData();
        if (!active) return;

        if (checkin === null) {
          setStatus("checked");
          setMessage("请先登录后再打卡");
          return;
        }

        const checkedToday = checkin.last_checkin_date === getTodayDateString();
        setStatus(checkedToday ? "checked" : "idle");
      } catch (error) {
        if (!active) return;
        console.error("[Checkin UI Error][loadStatus]:", error);
        setStatus("idle");
      }
    }

    loadStatus();
    return () => {
      active = false;
    };
  }, []);

  const disabled = status === "loading" || status === "checked" || submitting;

  const buttonLabel = useMemo(() => {
    if (status === "loading") return "加载中...";
    if (status === "checked") return "今日已舒缓";
    if (submitting) return "正在记录...";
    return "轻柔打卡";
  }, [status, submitting]);

  async function handleCheckin() {
    if (disabled) return;
    setSubmitting(true);

    try {
      const result = await performCheckin();
      if (result.checked_in_today) {
        setStatus("checked");
        await onCheckedIn?.();
        // 温柔反馈文案，避免“任务压力感”
        setMessage("今天也辛苦啦，感谢你花时间照顾自己的身体");
      }
    } catch (error) {
      console.error("[Checkin UI Error][handleCheckin]:", error);
      setMessage("网络有点忙，稍后我们再轻轻试一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <button
        type="button"
        onClick={handleCheckin}
        disabled={disabled}
        className={[
          "w-full rounded-2xl px-6 py-3 text-sm font-medium transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-[#A8C3A1]/45 focus:ring-offset-2",
          status === "idle"
            ? "bg-[#A8C3A1] text-[#1F3A32] shadow-[0_8px_22px_rgba(168,195,161,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(168,195,161,0.38)]"
            : "bg-[#E6D7DD] text-[#6E6067] opacity-90",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        {buttonLabel}
      </button>

      {/* 轻量级温柔消息提示，可作为独立组件直接嵌入页面 */}
      {message ? (
        <p className="mt-3 rounded-2xl border border-[#E6D7DD] bg-[#FAF6F8] px-4 py-3 text-sm leading-relaxed text-[#6B5C63]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
