import type { ReactNode } from "react";
import { colors } from "../../theme/tokens";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: colors.background,
        display: "flex",
        flexDirection: "column",
        color: colors.textPrimary,
      }}
    >
      <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: "20px 16px 24px" }}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
