import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors, fonts } from "../theme/tokens";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

const inputStyle: React.CSSProperties = {
  background: colors.cardWhite,
  border: `1.5px solid ${colors.border}`,
  borderRadius: 12,
  padding: "12px 14px",
  fontFamily: fonts.body,
  fontSize: 13.5,
  fontWeight: 600,
  color: colors.textPrimary,
  width: "100%",
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@petmarket.test");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "登入失敗,請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.background, padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 26, color: colors.accentDefault }}>毛孩市集</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, marginTop: 6 }}>登入你的帳號</div>
        </div>

        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="密碼" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <div style={{ fontSize: 12.5, fontWeight: 700, color: "#C85A38" }}>{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: colors.accentDefault,
            borderRadius: 999,
            padding: 14,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 14,
            color: colors.offWhite,
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "登入中..." : "登入"}
        </button>

        <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 600, color: colors.textSecondary }}>
          還沒有帳號?{" "}
          <Link to="/register" style={{ fontWeight: 700 }}>
            立即註冊
          </Link>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: colors.textMuted, marginTop: 8 }}>
          示範帳號:demo@petmarket.test / Passw0rd!1
        </div>
      </form>
    </div>
  );
}
