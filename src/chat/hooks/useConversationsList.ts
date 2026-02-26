"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Conversation,
  CreateDirectConversationPayload,
  CreateGroupConversationPayload,
  AddParticipantsPayload,
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
}

/**
 * Hook for managing conversations (both direct and group)
 * Provides methods to create, fetch, and manage conversations
 * 
 * Usage:
 * const {
 *   conversations,
 *   loading,
 *   createDirectConversation,
 *   createGroupConversation,
 *   markAsRead
 * } = useConversations();
 */
export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all conversations
   */
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getConversationsList();
      setConversations(data);
      console.log("📋 Loaded conversations:", data.length);
      
      if (data.length === 0) {
        console.log("💡 No conversations yet - start by messaging a contact");
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch conversations:", err);
      const errorMsg = err.response?.data?.detail || "Failed to load conversations";
      setError(errorMsg);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

        console.log("Creating direct conversation with user:", otherUserId);
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
        console.error("Failed to create direct conversation:", err);
        
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
        return conv.participants?.some((p) => p.user_id === otherUserId) || false;
      });

      if (existing) {
        console.log("Found existing conversation:", existing);
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

        console.log("Creating group conversation:", payload);
        const conversation = await chatService.createGroupConversation(payload);

        // Add to local state
        setConversations((prev) => [conversation, ...prev]);

        notify.success(`Group "${name}" created`);
        return conversation;
      } catch (err) {
        console.error("Failed to create group conversation:", err);
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
      console.error("Failed to mark conversation as read (REST):", err);
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
        console.error("Failed to add participants:", err);
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
        console.error("Failed to remove participant:", err);
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
  };
}
