import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/AuthShell";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, MailCheck } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "注册 — 觉体BodyAwake" },
      { name: "description", content: "创建你的觉体BodyAwake账号，开启温柔身体陪伴。" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

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
    const { error } = await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      setError(translate(error));
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <AuthShell
        title="注册成功 🌱"
        subtitle="我们已经向你的邮箱发送了验证邮件，请前往邮箱完成验证后再登录。"
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
          <p className="mt-4 text-[12.5px] leading-relaxed text-ink-soft">
            如果几分钟后还没收到，请检查垃圾邮件夹，或重新尝试注册。
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/login" })}
          className="mt-5 h-12 w-full rounded-2xl bg-primary text-[15px] text-primary-foreground shadow-soft hover:bg-primary/90"
        >
          去登录
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="创建账号 🌷"
      subtitle="只需要邮箱和密码，无需复杂资料。"
      footer={
        <>
          已经有账号了？
          <Link to="/login" className="ml-1 text-sage-deep underline-offset-2">
            去登录
          </Link>
        </>
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

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[13px] text-ink-soft">
            密码
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
            再次确认密码
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
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "注册"}
        </Button>

        <p className="pt-1 text-center text-[11.5px] leading-relaxed text-muted-foreground">
          注册即代表同意我们的温柔陪伴：本产品仅做体态科普，不做医疗诊断。
        </p>
      </form>
    </AuthShell>
  );
}

function translate(msg: string): string {
  if (msg.toLowerCase().includes("already registered") || msg.includes("already")) {
    return "这个邮箱已经注册过了，去登录吧";
  }
  if (msg.toLowerCase().includes("password")) return "密码不符合要求，至少 6 位";
  return msg;
}
