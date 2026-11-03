import { startTransition, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { colors, fonts } from "../theme/tokens";
import { fetchProfile } from "../api/profile";
import { useAuth } from "../context/AuthContext";
import { ProfileIcon, ChevronRightIcon } from "../components/icons/NavIcons";
import type { Profile } from "../types";

const MENU: { label: string; to?: string }[] = [
  { label: "我的商品", to: "/my-products" },
  { label: "帳戶設定" },
  { label: "收付款方式" },
  { label: "出貨地址" },
  { label: "客服中心" },
];

export function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile().then(setProfile).catch(() => {});
  }, []);

  return (
    <AppShell>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 999,
              background: profile?.avatarColorHex ?? colors.accentDefault,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ProfileIcon size={30} color={colors.offWhite} />
          </div>
          <div>
            <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 17 }}>{profile?.displayName ?? "..."}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, marginTop: 3 }}>編輯個人資料</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div onClick={() => navigate("/my-products?tab=listed")} style={{ flex: 1, background: "#DCEEE5", borderRadius: 16, padding: 14, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 19 }}>{profile?.stats.activeListings ?? 0}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#5C4C42", marginTop: 3 }}>上架中</div>
          </div>
          <div onClick={() => navigate("/favorites")} style={{ flex: 1, background: "#F8DDE7", borderRadius: 16, padding: 14, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 19 }}>{profile?.stats.favorites ?? 0}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#5C4C42", marginTop: 3 }}>已收藏</div>
          </div>
          <div onClick={() => navigate("/my-products?tab=sold")} style={{ flex: 1, background: "#F7E3D0", borderRadius: 16, padding: 14, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 19 }}>{profile?.stats.sold ?? 0}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#5C4C42", marginTop: 3 }}>已成交</div>
          </div>
        </div>

        <div style={{ background: colors.cardWhite, borderRadius: 18, overflow: "hidden", boxShadow: "0 3px 10px rgba(58,46,40,0.06)" }}>
          {MENU.map(({ label, to }) => (
            <div
              key={label}
              onClick={to ? () => navigate(to) : undefined}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: `1px solid ${colors.divider}`, cursor: to ? "pointer" : undefined }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 10, background: colors.background, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: colors.textSecondary }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{label}</div>
              <ChevronRightIcon />
            </div>
          ))}
        </div>

        <div
          onClick={() =>
            startTransition(() => {
              navigate("/");
              logout();
            })
          }
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: 13,
            color: "#C85A38",
            padding: 12,
            cursor: "pointer",
          }}
        >
          登出
        </div>
      </div>
    </AppShell>
  );
}
