import { startTransition, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors, fonts } from "../../theme/tokens";
import { AvatarMascotIcon } from "../icons/MascotIcon";
import { ProfileIcon } from "../icons/NavIcons";
import { useAuth } from "../../context/AuthContext";
import { useLoginRedirect } from "../../hooks/useLoginRedirect";

const MENU_ITEMS: { label: string; to?: string; hint?: string }[] = [
  { label: "會員中心", to: "/profile" },
  { label: "我的訂單", hint: "即將推出" },
  { label: "我的商品", to: "/my-products" },
];

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!user) return null;

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const handleLogout = () => {
    setOpen(false);
    // React Router applies navigation in a transition; logging out in the same transition
    // commits both together so ProtectedRoute never sees "logged out on a member page".
    startTransition(() => {
      navigate("/");
      logout();
    });
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 12px 4px 4px",
          borderRadius: 999,
          background: colors.cardWhite,
          border: `1.5px solid ${colors.border}`,
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: user.avatarColorHex,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ProfileIcon size={15} color={colors.offWhite} />
        </span>
        <span className="topbar-username" style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>
          {user.displayName}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            minWidth: 180,
            background: colors.cardWhite,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(58,46,40,0.16)",
            overflow: "hidden",
            zIndex: 20,
          }}
        >
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.divider}` }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{user.displayName}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, marginTop: 2 }}>{user.email}</div>
          </div>
          {MENU_ITEMS.map((item) => (
            <div
              key={item.label}
              role="menuitem"
              onClick={item.to ? () => go(item.to!) : undefined}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "11px 16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: item.to ? "pointer" : "default",
                color: item.to ? colors.textPrimary : colors.textMuted,
              }}
            >
              {item.label}
              {item.hint && <span style={{ fontSize: 10.5, fontWeight: 700 }}>{item.hint}</span>}
            </div>
          ))}
          <div
            role="menuitem"
            onClick={handleLogout}
            style={{ padding: "11px 16px", fontSize: 13, fontWeight: 700, color: colors.accentDark, cursor: "pointer", borderTop: `1px solid ${colors.divider}` }}
          >
            登出
          </div>
        </div>
      )}
    </div>
  );
}

export function TopBar() {
  const { user, isLoading } = useAuth();
  const goToLogin = useLoginRedirect();

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 16px",
        background: "rgba(251,243,234,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${colors.divider}`,
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <AvatarMascotIcon size={32} bgColor="#F7C873" />
        <span style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 20, color: colors.accentDefault }}>毛孩市集</span>
      </Link>

      {!isLoading &&
        (user ? (
          <UserMenu />
        ) : (
          <button
            onClick={goToLogin}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              background: colors.accentDefault,
              color: colors.offWhite,
              fontSize: 13,
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(233,113,76,0.3)",
            }}
          >
            登入／註冊
          </button>
        ))}
    </div>
  );
}
