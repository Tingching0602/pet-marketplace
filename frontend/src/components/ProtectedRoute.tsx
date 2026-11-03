import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/tokens";
import type { LoginRedirectState } from "../hooks/useLoginRedirect";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.background }}>
        <div style={{ color: colors.textMuted, fontWeight: 700 }}>載入中...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location } satisfies LoginRedirectState} />;

  return <>{children}</>;
}
