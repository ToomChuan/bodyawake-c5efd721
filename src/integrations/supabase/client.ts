import { createClient } from "@supabase/supabase-js";

// 外部自建 Supabase（公开 publishable key，可安全用于前端）
const SUPABASE_URL = "https://vcnyykwgvidwobcxbifj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_s_8sB3KfiqEp0xB57tx7PQ_BCnzIeMq";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
