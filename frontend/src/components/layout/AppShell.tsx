import type { ReactNode } from "react";
import { colors } from "../../theme/tokens";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

// `wide` lets product grids use the full desktop width; other pages keep a readable column.
export function AppShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      className="app-shell"
      style={{
        margin: "0 auto",
        minHeight: "100vh",
        background: colors.background,
        display: "flex",
        flexDirection: "column",
        color: colors.textPrimary,
      }}
    >
      <TopBar />
      <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        <div className={wide ? "page-content page-content--wide" : "page-content"}>{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}
