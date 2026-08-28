import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../../theme/tokens";
import { HeartIcon, MessagesIcon, PlusIcon, ProfileIcon, RefreshIcon } from "../icons/NavIcons";
import { useConversationsUnread } from "../../context/ConversationsContext";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const { totalUnread } = useConversationsUnread();

  const colorFor = (active: boolean) => (active ? colors.accentDefault : colors.textMuted);

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 700);
    if (location.pathname === "/") {
      window.dispatchEvent(new Event("feed-refresh"));
    } else {
      navigate("/");
    }
  };

  const itemStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
  };
  const labelStyle = (active: boolean): React.CSSProperties => ({
    fontSize: 10.5,
    fontWeight: 700,
    color: colorFor(active),
  });

  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        background: colors.offWhite,
        borderRadius: "26px 26px 0 0",
        boxShadow: "0 -6px 20px rgba(58,46,40,0.10)",
        display: "flex",
        alignItems: "flex-end",
        padding: "10px 6px 14px",
        zIndex: 2,
      }}
    >
      <div style={itemStyle} onClick={() => navigate("/messages")}>
        <div style={{ position: "relative" }}>
          <MessagesIcon color={colorFor(location.pathname.startsWith("/messages"))} />
          {totalUnread > 0 && (
            <div
              style={{
                position: "absolute",
                top: -2,
                right: -3,
                width: 9,
                height: 9,
                borderRadius: 999,
                background: colors.accentDefault,
                border: `1.5px solid ${colors.offWhite}`,
              }}
            />
          )}
        </div>
        <div style={labelStyle(location.pathname.startsWith("/messages"))}>對話</div>
      </div>

      <div style={itemStyle} onClick={() => navigate("/favorites")}>
        <HeartIcon color={colorFor(location.pathname === "/favorites")} />
        <div style={labelStyle(location.pathname === "/favorites")}>收藏</div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          onClick={() => navigate("/sell")}
          style={{
            width: 50,
            height: 50,
            borderRadius: 999,
            background: colors.accentDefault,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -30,
            boxShadow: "0 6px 14px rgba(233,113,76,0.4)",
            cursor: "pointer",
            border: `4px solid ${colors.background}`,
          }}
        >
          <PlusIcon />
        </div>
        <div style={{ ...labelStyle(location.pathname === "/sell"), marginTop: 2 }}>銷售</div>
      </div>

      <div style={itemStyle} onClick={handleRefresh}>
        <RefreshIcon className={spinning ? "spinning" : ""} color={colors.textMuted} />
        <div style={labelStyle(false)}>更新</div>
      </div>

      <div style={itemStyle} onClick={() => navigate("/profile")}>
        <ProfileIcon color={colorFor(location.pathname === "/profile")} />
        <div style={labelStyle(location.pathname === "/profile")}>個人帳戶</div>
      </div>
    </div>
  );
}
