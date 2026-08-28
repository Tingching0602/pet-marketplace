import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { AvatarMascotIcon } from "../components/icons/MascotIcon";
import { colors } from "../theme/tokens";
import { useConversationsUnread } from "../context/ConversationsContext";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "剛剛";
  if (diffMin < 60) return `${diffMin}分鐘前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}小時前`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "昨天";
  return `${diffDay}天前`;
}

export function MessagesPage() {
  const navigate = useNavigate();
  const { conversations } = useConversationsUnread();

  return (
    <AppShell>
      <PageHeader title="對話" backTo="/" />

      {conversations.length === 0 && (
        <div style={{ color: colors.textMuted, fontWeight: 600, fontSize: 13, textAlign: "center", padding: "50px 20px" }}>
          還沒有任何對話。到商品詳情頁點「訊息賣家」開始聊天吧!
        </div>
      )}

      {conversations.length > 0 && (
        <div style={{ background: colors.cardWhite, borderRadius: 18, overflow: "hidden", boxShadow: "0 3px 10px rgba(58,46,40,0.06)" }}>
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/messages/${c.id}`)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: `1px solid ${colors.divider}`, cursor: "pointer" }}
            >
              <AvatarMascotIcon bgColor={c.otherPartyAvatarColorHex} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{c.otherPartyName}</div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: colors.textSecondary,
                    marginTop: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.lastMessage ?? "尚無訊息"}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: colors.textMuted }}>{formatRelativeTime(c.lastMessageAt)}</div>
                {c.unreadCount > 0 && (
                  <div
                    style={{
                      minWidth: 18,
                      height: 18,
                      borderRadius: 999,
                      background: colors.accentDefault,
                      color: colors.offWhite,
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 5px",
                    }}
                  >
                    {c.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
