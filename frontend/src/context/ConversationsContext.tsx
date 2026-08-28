import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as conversationsApi from "../api/conversations";
import type { ConversationListItem } from "../types";
import { useAuth } from "./AuthContext";

interface ConversationsContextValue {
  conversations: ConversationListItem[];
  totalUnread: number;
  refresh: () => Promise<void>;
}

const ConversationsContext = createContext<ConversationsContextValue | null>(null);

const POLL_INTERVAL_MS = 15000;

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);

  const refresh = async () => {
    if (!user) {
      setConversations([]);
      return;
    }
    try {
      const items = await conversationsApi.fetchConversations();
      setConversations(items);
    } catch {
      // ignore transient polling failures
    }
  };

  useEffect(() => {
    refresh();
    if (!user) return;
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <ConversationsContext.Provider value={{ conversations, totalUnread, refresh }}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversationsUnread() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversationsUnread must be used within ConversationsProvider");
  return ctx;
}
