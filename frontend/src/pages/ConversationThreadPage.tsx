import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { colors, fonts } from "../theme/tokens";
import { fetchMessages, sendMessage } from "../api/conversations";
import { useConversationsUnread } from "../context/ConversationsContext";
import type { MessageItem } from "../types";

const POLL_INTERVAL_MS = 5000;

export function ConversationThreadPage() {
  const { id } = useParams();
  const conversationId = Number(id);
  const { conversations, refresh: refreshConversations } = useConversationsUnread();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find((c) => c.id === conversationId);

  const load = () => {
    fetchMessages(conversationId)
      .then(setMessages)
      .then(refreshConversations)
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const handleSend = async () => {
    if (!draft.trim()) return;
    setSending(true);
    try {
      const msg = await sendMessage(conversationId, draft.trim());
      setMessages((prev) => [...prev, msg]);
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell>
      <PageHeader title={conversation?.otherPartyName ?? "對話"} backTo="/messages" />

      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 300 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.isOwnMessage ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "75%",
                background: m.isOwnMessage ? colors.accentDefault : colors.cardWhite,
                color: m.isOwnMessage ? colors.offWhite : colors.textPrimary,
                borderRadius: 16,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.5,
                boxShadow: "0 2px 8px rgba(58,46,40,0.06)",
              }}
            >
              {m.body}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ position: "sticky", bottom: 82, display: "flex", gap: 8, marginTop: 16, background: colors.background, paddingTop: 8 }}>
        <input
          type="text"
          placeholder="輸入訊息..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          style={{
            flex: 1,
            minWidth: 0,
            background: colors.cardWhite,
            border: `1.5px solid ${colors.border}`,
            borderRadius: 999,
            padding: "12px 16px",
            fontFamily: fonts.body,
            fontSize: 13.5,
            fontWeight: 600,
            color: colors.textPrimary,
          }}
        />
        <div
          onClick={sending ? undefined : handleSend}
          style={{
            flexShrink: 0,
            padding: "12px 20px",
            borderRadius: 999,
            background: colors.accentDefault,
            color: colors.offWhite,
            fontWeight: 700,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            opacity: sending ? 0.7 : 1,
          }}
        >
          送出
        </div>
      </div>
    </AppShell>
  );
}
