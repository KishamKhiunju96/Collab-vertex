"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useChatWebSocket } from "./useChatWebSocket";
import { chatService } from "@/api/services/chatService";
import { ChatMessage } from "@/chat/types";
import { notify } from "@/utils/notify";

/**
 * @deprecated This hook uses the old user-to-user chat pattern.
 * For new implementations, use:
 * - useConversations() from "./useConversationsList" for conversation management
 * - useConversationWebSocket() from "./useConversationWebSocket" for real-time messaging
 * 
 * This hook is kept for backward compatibility with existing ChatRoom.tsx component.
 * 
 * Migration guide:
 * 1. Create/get conversation: getOrCreateDirectConversation(otherUserId)
 * 2. Connect WebSocket: useConversationWebSocket({ conversationId, autoConnect: true })
 * 3. Fetch messages: chatService.getConversationMessages(conversationId)
 */

interface UseChatProps {
  otherUserId: string;
  enabled?: boolean;
}

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  loadMoreMessages: () => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  reconnect: () => void;
  markAsRead: (messageIds: string[]) => void;
}

/**
 * @deprecated Use useConversations() and useConversationWebSocket() instead
 * Comprehensive chat hook that combines WebSocket for real-time messaging
 * and REST API for loading message history
 */
export function useChat({
  otherUserId,
  enabled = true,
}: UseChatProps): UseChatReturn {
  console.log("useChat initialized:", { otherUserId, enabled });
  
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 50;
  const hasFetchedInitial = useRef(false);

  // WebSocket connection for real-time messages
  const {
    sendMessage: wsSendMessage,
    isConnected,
    messages: wsMessages,
    error: wsError,
    reconnect,
  } = useChatWebSocket({
    otherUserId: enabled && otherUserId ? otherUserId : "",
    onMessageReceived: (message) => {
      console.log("useChat - Message received via WebSocket:", message);
      // Add received message to the list if not already present
      setAllMessages((prev) => {
        // Ensure prev is an array
        const safePrev = Array.isArray(prev) ? prev : [];
        const exists = safePrev.some((msg) => msg.id === message.id);
        if (exists) return safePrev;
        return [...safePrev, message];
      });
    },
    onConnectionChange: (connected) => {
      console.log("useChat - WebSocket connection changed:", connected);
      if (connected && !hasFetchedInitial.current) {
        // Load initial messages when connected
        loadInitialMessages();
      }
    },
  });

  /**
   * Load initial batch of messages from REST API
   */
  const loadInitialMessages = useCallback(async () => {
    if (!otherUserId || !enabled || hasFetchedInitial.current) return;

    setIsLoading(true);
    try {
      const messages = await chatService.getMessages(otherUserId, {
        limit,
        offset: 0,
      });

      // Ensure messages is an array
      const safeMessages = Array.isArray(messages) ? messages : [];
      console.log("Loaded initial messages:", { count: safeMessages.length, isArray: Array.isArray(messages), raw: messages });
      
      setAllMessages(safeMessages);
      setOffset(safeMessages.length);
      setHasMore(safeMessages.length === limit);
      hasFetchedInitial.current = true;
    } catch (error) {
      console.error("Failed to load initial messages:", error);
      notify.error("Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  }, [otherUserId, enabled]);

  /**
   * Load more messages (pagination)
   */
  const loadMoreMessages = useCallback(async () => {
    if (!otherUserId || !enabled || isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const messages = await chatService.getMessages(otherUserId, {
        limit,
        offset,
      });

      // Ensure messages is an array
      const safeMessages = Array.isArray(messages) ? messages : [];
      
      if (safeMessages.length > 0) {
        // Prepend older messages
        setAllMessages((prev) => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return [...safeMessages, ...safePrev];
        });
        setOffset((prev) => prev + safeMessages.length);
        setHasMore(safeMessages.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more messages:", error);
      notify.error("Failed to load more messages");
    } finally {
      setIsLoading(false);
    }
  }, [otherUserId, enabled, isLoading, hasMore, offset]);

  /**
   * Send a message via WebSocket or simulate in demo mode
   */
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      wsSendMessage(content);
    },
    [wsSendMessage],
  );

  /**
   * Mark messages as read
   */
  const markAsRead = useCallback((messageIds: string[]) => {
    // Update local state
    setAllMessages((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map((msg) =>
        messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg,
      );
    });

    // You can also call API to mark as read on server
    chatService.markMessagesAsRead(messageIds).catch((err) => {
      console.error("Failed to mark messages as read:", err);
    });
  }, []);

  // Load initial messages on mount
  useEffect(() => {
    if (enabled && otherUserId && isConnected && !hasFetchedInitial.current) {
      loadInitialMessages();
    }
  }, [enabled, otherUserId, isConnected, loadInitialMessages]);

  // Reset state when otherUserId changes
  useEffect(() => {
    setAllMessages([]);
    setOffset(0);
    setHasMore(true);
    hasFetchedInitial.current = false;
  }, [otherUserId]);

  // Merge WebSocket messages with existing messages
  useEffect(() => {
    if (Array.isArray(wsMessages) && wsMessages.length > 0) {
      setAllMessages((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const newMessages = wsMessages.filter(
          (wsMsg) => !safePrev.some((msg) => msg.id === wsMsg.id),
        );
        return [...safePrev, ...newMessages];
      });
    }
  }, [wsMessages]);

  // Debug logging
  console.log("useChat returning:", {
    messagesCount: allMessages.length,
    messagesType: typeof allMessages,
    isArray: Array.isArray(allMessages),
    allMessages: allMessages,
  });

  return {
    messages: allMessages,
    sendMessage,
    loadMoreMessages,
    isConnected,
    isLoading,
    hasMore,
    error: wsError,
    reconnect,
    markAsRead,
  };
}
