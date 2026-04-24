import { supabase } from "@/integrations/supabase/client";

export type CheckinData = {
  current_streak: number;
  unlocked_badges: string[];
  last_checkin_date: string | null;
};

const DEFAULT_CHECKIN_DATA: CheckinData = {
  current_streak: 0,
  unlocked_badges: [],
  last_checkin_date: null,
};

function normalizeBadges(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string");
}

export async function getCheckinData(): Promise<CheckinData | null> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("user_checkins")
      .select("current_streak, unlocked_badges, last_checkin_date")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return DEFAULT_CHECKIN_DATA;
    }

    return {
      current_streak: data.current_streak ?? 0,
      unlocked_badges: normalizeBadges(data.unlocked_badges),
      last_checkin_date: data.last_checkin_date ?? null,
    };
  } catch (error) {
    console.error("[Checkin API Error][getCheckinData]:", error);
    throw error;
  }
}

export type PerformCheckinResult = CheckinData & {
  checked_in_today: boolean;
  newly_unlocked_badges: string[];
};

export async function performCheckin(): Promise<PerformCheckinResult> {
  try {
    const { data, error } = await supabase.rpc("check_in");

    if (error) {
      throw error;
    }

    // Postgres RPC 返回表结构时通常是数组，这里同时兼容对象返回。
    const row = Array.isArray(data) ? data[0] : data;

    if (!row) {
      return {
        ...DEFAULT_CHECKIN_DATA,
        checked_in_today: false,
        newly_unlocked_badges: [],
      };
    }

    return {
      current_streak: row.current_streak ?? 0,
      unlocked_badges: normalizeBadges(row.unlocked_badges),
      last_checkin_date: row.last_checkin_date ?? null,
      checked_in_today: Boolean(row.checked_in_today),
      newly_unlocked_badges: normalizeBadges(row.newly_unlocked_badges),
    };
  } catch (error) {
    console.error("[Checkin API Error][performCheckin]:", error);
    throw error;
  }
}
