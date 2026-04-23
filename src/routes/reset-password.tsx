import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AuthShell } from "@/components/AuthShell";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "重置密码 — 觉体BodyAwake" },
      { name: "description", content: "为你的觉体BodyAwake账号设置新密码。" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Supabase 在邮件链接里带 access_token，client 在 detectSessionInUrl 时会自动建立 recovery session
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // 先检查是否已经有 recovery session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("密码至少需要 6 位哦");
      return;
    }
    if (password !== confirm) {
      setError("两次输入的密码不一致");
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/profile" }), 1500);
  };

  if (done) {
    return (
      <AuthShell title="密码已更新 ✨" subtitle="正在带你回到「我的」页面…">
        <div className="flex flex-col items-center rounded-3xl bg-white p-8 shadow-soft">
          <CheckCircle2 className="h-12 w-12 text-sage-deep" strokeWidth={1.6} />
          <p className="mt-3 text-[13px] text-ink-soft">设置成功</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="设置新密码"
      subtitle={ready ? "请输入你的新密码，至少 6 位。" : "正在验证重置链接…"}
      footer={
        <Link to="/login" className="text-sage-deep underline-offset-2">
          返回登录
        </Link>
      }
    >
      {!ready ? (
        <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-soft">
          <Loader2 className="h-5 w-5 animate-spin text-ink-soft" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px] text-ink-soft">
              新密码
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              className="h-12 rounded-2xl border-border/70 bg-white px-4 text-[15px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-[13px] text-ink-soft">
              确认新密码
            </Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="再输入一次"
              className="h-12 rounded-2xl border-border/70 bg-white px-4 text-[15px]"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-soft/60 px-4 py-2.5 text-[12.5px] text-accent">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-primary text-[15px] text-primary-foreground shadow-soft hover:bg-primary/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "更新密码"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
