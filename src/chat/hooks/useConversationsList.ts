"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Conversation,
  CreateDirectConversationPayload,
  CreateGroupConversationPayload,
  AddParticipantsPayload,
  ConversationMessage,
} from "@/chat/types";
import { chatService } from "@/api/services/chatService";
import { notify } from "@/utils/notify";

interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createDirectConversation: (otherUserId: string) => Promise<Conversation | null>;
  createGroupConversation: (
    name: string,
    participantIds: string[],
    description?: string,
    avatarUrl?: string
  ) => Promise<Conversation | null>;
  markAsRead: (conversationId: string) => Promise<void>;
  addParticipants: (conversationId: string, userIds: string[]) => Promise<void>;
  removeParticipant: (conversationId: string, userId: string) => Promise<void>;
  getOrCreateDirectConversation: (otherUserId: string) => Promise<Conversation | null>;
  updateConversationMessage: (conversationId: string, message: ConversationMessage) => void;
}

/**
 * Hook for managing conversations (both direct and group)
 * Provides methods to create, fetch, and manage conversations
 * 
 * ENHANCED: Real-time conversation updates
 * - Automatically sorts conversations by most recent message
 * - Updates conversation when new messages arrive
 * - Tracks unread counts
 * 
 * Usage:
 * const {
 *   conversations,
 *   loading,
 *   createDirectConversation,
 *   createGroupConversation,
 *   markAsRead,
 *   updateConversationMessage
 * } = useConversations();
 */
export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sort conversations by most recent message
   */
  const sortConversations = useCallback((convs: Conversation[]): Conversation[] => {
    return [...convs].sort((a, b) => {
      const timeA = a.last_message_at || a.updated_at || a.created_at;
      const timeB = b.last_message_at || b.updated_at || b.created_at;
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
  }, []);

  /**
   * Update a conversation when a new message is received
   * Moves it to the top of the list
   */
  const updateConversationMessage = useCallback((conversationId: string, message: ConversationMessage) => {
    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            last_message: message,
            last_message_at: message.sent_at || message.timestamp || message.created_at,
            last_message_id: message.id,
          };
        }
        return conv;
      });
      
      // Sort to move updated conversation to top
      return sortConversations(updated);
    });
  }, [sortConversations]);

  /**
   * Fetch all conversations
   */
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getConversationsList();
      
      // Sort conversations by most recent message
      const sorted = sortConversations(data);
      setConversations(sorted);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to load conversations";
      setError(errorMsg);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [sortConversations]);

  /**
   * Refresh conversations list
   */
  const refresh = useCallback(async () => {
    await fetchConversations();
  }, [fetchConversations]);

  /**
   * Create a direct conversation with another user
   * @param otherUserId - The other user's ID (user UUID from chatable contacts)
   * @returns The created conversation or null if failed
   */
  const createDirectConversation = useCallback(
    async (otherUserId: string): Promise<Conversation | null> => {
      try {
        const payload: CreateDirectConversationPayload = {
          other_user_id: otherUserId, // Field name is other_user_id, value is user UUID from Users table
        };

        const conversation = await chatService.createDirectConversation(payload);

        // Add to local state
        setConversations((prev) => {
          // Check if conversation already exists
          const exists = prev.find((c) => c.id === conversation.id);
          if (exists) {
            return prev;
          }
          return [conversation, ...prev];
        });

        notify.success("Conversation created");
        return conversation;
      } catch (err: any) {
        
        // Check if conversation already exists (409 Conflict)
        if (err.response?.status === 409) {
          notify.info("Conversation already exists");
          // Try to fetch the existing conversation
          await refresh();
          return null;
        }
        
        notify.error("Failed to create conversation");
        return null;
      }
    },
    [refresh]
  );

  /**
   * Get existing conversation or create new one if it doesn't exist
   * Useful for clicking on a user to start chatting
   * @param otherUserId - The other user's ID (user UUID from chatable contacts)
   */
  const getOrCreateDirectConversation = useCallback(
    async (otherUserId: string): Promise<Conversation | null> => {
      // First, check if conversation already exists
      const existing = conversations.find((conv) => {
        if (conv.type !== 'DIRECT') return false;
        return conv.participants?.some((p) => p.id === otherUserId) || false;
      });

      if (existing) {
        return existing;
      }

      // Create new conversation
      return await createDirectConversation(otherUserId);
    },
    [conversations, createDirectConversation]
  );

  /**
   * Create a group conversation
   * @param name - Group name
   * @param participantUserIds - Array of participant user IDs (user UUIDs from chatable contacts)
   * @param description - Optional group description
   * @param avatarUrl - Optional group avatar URL
   * @returns The created conversation or null if failed
   */
  const createGroupConversation = useCallback(
    async (
      name: string,
      participantUserIds: string[],
      description?: string,
      avatarUrl?: string
    ): Promise<Conversation | null> => {
      try {
        const payload: CreateGroupConversationPayload = {
          name,
          participant_ids: participantUserIds, // Field name is participant_ids, values are user UUIDs
          description,
          avatar_url: avatarUrl,
        };

        const conversation = await chatService.createGroupConversation(payload);

        // Add to local state
        setConversations((prev) => [conversation, ...prev]);

        notify.success(`Group "${name}" created`);
        return conversation;
      } catch (err) {
        notify.error("Failed to create group");
        return null;
      }
    },
    []
  );

  /**
   * Mark a conversation as read (REST API)
   * 
   * @deprecated Use WebSocket read receipt instead
   * In ConversationChatRoom component, use markAsReadWS() from useConversationWebSocket
   * Sends { type: "read" } via WebSocket for real-time read receipts
   * 
   * This REST API method may not be supported by backend
   */
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await chatService.markConversationAsRead(conversationId);

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        )
      );
    } catch (err) {
      // Don't show error notification - WebSocket handles this
    }
  }, []);

  /**
   * Add participants to a group conversation
   * @param conversationId - Conversation UUID
   * @param profileIds - Array of profile IDs (UUIDs) to add
   */
  const addParticipants = useCallback(
    async (conversationId: string, profileIds: string[]) => {
      try {
        const payload: AddParticipantsPayload = { user_ids: profileIds };
        await chatService.addParticipants(conversationId, payload);

        // Refresh to get updated participant list
        await refresh();

        notify.success("Participants added");
      } catch (err) {
        notify.error("Failed to add participants");
      }
    },
    [refresh]
  );

  /**
   * Remove a participant from a group conversation
   * @param conversationId - Conversation UUID
   * @param profileId - Profile ID (UUID) to remove
   */
  const removeParticipant = useCallback(
    async (conversationId: string, profileId: string) => {
      try {
        await chatService.removeParticipant(conversationId, profileId);

        // Refresh to get updated participant list
        await refresh();

        notify.success("Participant removed");
      } catch (err) {
        notify.error("Failed to remove participant");
      }
    },
    [refresh]
  );

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refresh,
    createDirectConversation,
    createGroupConversation,
    markAsRead,
    addParticipants,
    removeParticipant,
    getOrCreateDirectConversation,
    updateConversationMessage,
  };
}
