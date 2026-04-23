import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/AuthShell";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, MailCheck } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "找回密码 — 觉体BodyAwake" },
      { name: "description", content: "通过邮箱重置你的觉体BodyAwake账号密码。" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <AuthShell
        title="邮件已发送 💌"
        subtitle="我们已向你的邮箱发送了重置链接，点击邮件中的按钮即可设置新密码。"
        footer={
          <Link to="/login" className="text-sage-deep underline-offset-2">
            返回登录
          </Link>
        }
      >
        <div className="rounded-3xl bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-content-center rounded-full bg-sage-soft">
              <MailCheck className="h-5 w-5 text-sage-deep" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[14px] font-medium text-foreground">查收邮件</p>
              <p className="mt-0.5 text-[12px] text-ink-soft">{email}</p>
            </div>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="找回密码"
      subtitle="输入注册时使用的邮箱，我们会发送一封重置链接给你。"
      footer={
        <Link to="/login" className="text-sage-deep underline-offset-2">
          返回登录
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px] text-ink-soft">
            邮箱
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "发送重置邮件"}
        </Button>
      </form>
    </AuthShell>
  );
}
