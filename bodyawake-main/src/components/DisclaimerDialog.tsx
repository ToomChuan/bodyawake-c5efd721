import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const KEY = "warmcare:disclaimer-read";

export function DisclaimerDialog() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) {
        setOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAgree = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-3xl border-0 bg-cream p-7 shadow-float sm:max-w-[360px] [&>button]:hidden">
        <DialogHeader className="space-y-3 text-center sm:text-center">
          <div className="mx-auto grid h-14 w-14 place-content-center rounded-full bg-sage-soft">
            <Sparkles className="h-6 w-6 text-sage-deep" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-lg font-semibold text-foreground">
            使用前的小叮嘱
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-muted-foreground">
            觉体BodyAwake主打日常的<span className="text-sage-deep font-medium">动作纠正与体态引导</span>
            ，我们希望陪你温柔地认识自己的身体。
            <br />
            <br />
            如果出现持续疼痛、麻木、肿胀等不适，请<span className="text-foreground font-medium">及时就医</span>
            ，本应用不能替代医生诊断。
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={handleAgree}
          className="mt-2 h-11 w-full rounded-2xl bg-primary text-primary-foreground shadow-soft hover:bg-sage-deep"
        >
          我知道啦
        </Button>
      </DialogContent>
    </Dialog>
  );
}
