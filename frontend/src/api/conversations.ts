import { apiGet, apiPost } from "./client";
import type { ConversationListItem, MessageItem } from "../types";

export const fetchConversations = () => apiGet<ConversationListItem[]>("/conversations");

export const startConversation = (payload: { productId?: number; sellerId?: string }) =>
  apiPost<{ id: number }>("/conversations", payload);

export const fetchMessages = (conversationId: number) =>
  apiGet<MessageItem[]>(`/conversations/${conversationId}/messages`);

export const sendMessage = (conversationId: number, body: string) =>
  apiPost<MessageItem>(`/conversations/${conversationId}/messages`, { body });
