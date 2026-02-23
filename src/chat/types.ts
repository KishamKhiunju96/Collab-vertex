/**
 * Chat Types - Matching Backend Structure
 */

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: string; // ISO timestamp
  is_read: boolean;
  is_delivered: boolean;
}

export interface SendMessagePayload {
  content: string;
}

export interface GetMessagesParams {
  limit?: number;
  offset?: number;
}

export interface ChatUser {
  id: string;
  username: string;
  email?: string;
  role?: string;
}

export interface ChatConversation {
  user: ChatUser;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export enum WebSocketMessageType {
  MESSAGE = "message",
  TYPING = "typing",
  READ = "read",
  DELIVERED = "delivered",
  ERROR = "error",
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: ChatMessage | { typing: boolean } | { error: string };
}
