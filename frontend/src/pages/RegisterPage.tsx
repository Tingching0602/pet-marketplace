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

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, displayName);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "註冊失敗,請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.background, padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 26, color: colors.accentDefault }}>毛孩市集</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, marginTop: 6 }}>建立新帳號</div>
        </div>

        <input style={inputStyle} type="text" placeholder="暱稱" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="密碼(至少 6 碼)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

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
          {submitting ? "註冊中..." : "註冊並登入"}
        </button>

        <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 600, color: colors.textSecondary }}>
          已經有帳號了?{" "}
          <Link to="/login" style={{ fontWeight: 700 }}>
            登入
          </Link>
        </div>
      </form>
    </div>
  );
}
