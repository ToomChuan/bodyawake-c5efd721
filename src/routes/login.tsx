import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/AuthShell";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/profile",
  }),
  head: () => ({
    meta: [
      { title: "登录 — 觉体BodyAwake" },
      { name: "description", content: "登录觉体BodyAwake，温柔陪你认识身体。" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(translate(error));
      return;
    }
    navigate({ to: search.redirect });
  };

  return (
    <AuthShell
      title="欢迎回来 ☁️"
      subtitle="登录后可以收藏你喜欢的内容、记录经期和日常养护。"
      footer={
        <>
          还没有账号？
          <Link to="/signup" className="ml-1 text-sage-deep underline-offset-2">
            去注册
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 rounded-2xl border-border/70 bg-white px-4 text-[15px]"
          />
          <div className="pt-1 text-right">
            <Link to="/forgot-password" className="text-[12.5px] text-sage-deep">
              忘记密码？
            </Link>
          </div>
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
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "登录"}
        </Button>
      </form>
    </AuthShell>
  );
}

function translate(msg: string): string {
  if (msg.includes("Invalid login")) return "邮箱或密码不正确，请再试一次";
  if (msg.includes("Email not confirmed")) return "邮箱还没验证哦，请查收验证邮件";
  return msg;
}
