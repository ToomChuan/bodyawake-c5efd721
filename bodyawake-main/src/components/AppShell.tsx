import * as React from "react";
import { TabBar } from "./TabBar";
import { DisclaimerDialog } from "./DisclaimerDialog";

interface AppShellProps {
  children: React.ReactNode;
  /** 不显示底部 tab，比如详情页 */
  hideTabBar?: boolean;
}

export function AppShell({ children, hideTabBar = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-cream">
        <main className={hideTabBar ? "pb-24" : "pb-24"}>{children}</main>
        {!hideTabBar && <TabBar />}
        <DisclaimerDialog />
      </div>
    </div>
  );
}
