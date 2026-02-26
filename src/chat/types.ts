/**
 * Chat Types - Matching Backend Structure
 */

// Message structure for conversation-based chat
export interface ConversationMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  sender_name?: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
  timestamp: string; // ISO timestamp
  sent_at?: string; // Alternative timestamp field from API
  created_at: string;
  updated_at: string;
  edited_at?: string | null;
  deleted_at?: string | null;
  read_by?: string[];
  delivered_to?: string[];
  is_read?: boolean;
  is_delivered?: boolean;
}

// Conversation participant
// Note: Backend sends 'id' field, not 'user_id'
export interface ConversationParticipant {
  id: string; // User UUID from backend
  username: string;
  email?: string;
  role?: string;
  joined_at?: string;
}

// Conversation structure
export interface Conversation {
  id: string;
  type: "DIRECT" | "GROUP";
  name?: string; // For group chats
  description?: string; // For group chats
  avatar_url?: string; // For group chats
  participants?: ConversationParticipant[]; // May not be populated in list responses
  last_message?: ConversationMessage;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

// Legacy message structure (keep for backward compatibility)
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
  type?: "TEXT" | "IMAGE" | "FILE";
}

// Payload for creating direct conversation
// IMPORTANT: Field name is 'other_user_id' and expects user UUID from Users table
export interface CreateDirectConversationPayload {
  other_user_id: string; // User UUID from Users table (user_id field from chatable endpoints)
}

// Payload for creating group conversation
// IMPORTANT: Field name is 'participant_ids' and expects user UUIDs from Users table
export interface CreateGroupConversationPayload {
  name: string;
  participant_ids: string[]; // User UUIDs from Users table (user_id fields from chatable endpoints)
  description?: string;
  avatar_url?: string;
}

// Payload for adding participants
export interface AddParticipantsPayload {
  user_ids: string[];
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

// Export chatable types
export * from "./types/chatable";
