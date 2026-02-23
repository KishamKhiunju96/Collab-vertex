"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useChatWebSocket } from "./useChatWebSocket";
import { chatService } from "@/api/services/chatService";
import { ChatMessage } from "@/chat/types";
import { notify } from "@/utils/notify";
import { useUserData } from "@/api/hooks/useUserData";

// Check if we're in demo mode (development without backend)
const isDemoMode =
  process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_WS_URL;

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
 * Comprehensive chat hook that combines WebSocket for real-time messaging
 * and REST API for loading message history
 */
export function useChat({
  otherUserId,
  enabled = true,
}: UseChatProps): UseChatReturn {
  const { user } = useUserData();
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
    otherUserId: enabled ? otherUserId : "",
    onMessageReceived: (message) => {
      // Add received message to the list if not already present
      setAllMessages((prev) => {
        const exists = prev.some((msg) => msg.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    },
    onConnectionChange: (connected) => {
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

      setAllMessages(messages);
      setOffset(messages.length);
      setHasMore(messages.length === limit);
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

      if (messages.length > 0) {
        // Prepend older messages
        setAllMessages((prev) => [...messages, ...prev]);
        setOffset((prev) => prev + messages.length);
        setHasMore(messages.length === limit);
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

      // In demo mode, simulate message locally
      if (isDemoMode) {
        const demoMessage: ChatMessage = {
          id: `demo-${Date.now()}`,
          sender_id: user?.id || "current-user",
          receiver_id: otherUserId,
          content: content.trim(),
          sent_at: new Date().toISOString(),
          is_read: false,
          is_delivered: true,
        };

        setAllMessages((prev) => [...prev, demoMessage]);

        // Simulate a response after 2 seconds
        setTimeout(() => {
          const responses = [
            "Thanks for your message!",
            "Got it, I'll get back to you soon.",
            "Sounds good!",
            "Let me think about that.",
            "Absolutely, let's do it!",
          ];
          const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];

          const responseMessage: ChatMessage = {
            id: `demo-response-${Date.now()}`,
            sender_id: otherUserId,
            receiver_id: user?.id || "current-user",
            content: randomResponse,
            sent_at: new Date().toISOString(),
            is_read: false,
            is_delivered: true,
          };

          setAllMessages((prev) => [...prev, responseMessage]);
        }, 2000);

        return;
      }

      wsSendMessage(content);
    },
    [wsSendMessage, otherUserId, user?.id],
  );

  /**
   * Mark messages as read
   */
  const markAsRead = useCallback((messageIds: string[]) => {
    // Update local state
    setAllMessages((prev) =>
      prev.map((msg) =>
        messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg,
      ),
    );

    // You can also call API to mark as read on server
    chatService.markMessagesAsRead(messageIds).catch((err) => {
      console.error("Failed to mark messages as read:", err);
    });
  }, []);

  // Load initial messages on mount or add demo messages
  useEffect(() => {
    if (isDemoMode && enabled && otherUserId && !hasFetchedInitial.current) {
      // Add some demo messages
      const demoMessages: ChatMessage[] = [
        {
          id: "demo-1",
          sender_id: otherUserId,
          receiver_id: user?.id || "current-user",
          content: "Hi! Welcome to the chat.",
          sent_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          is_read: true,
          is_delivered: true,
        },
        {
          id: "demo-2",
          sender_id: user?.id || "current-user",
          receiver_id: otherUserId,
          content: "Hello! Thanks for reaching out.",
          sent_at: new Date(Date.now() - 86300000).toISOString(),
          is_read: true,
          is_delivered: true,
        },
        {
          id: "demo-3",
          sender_id: otherUserId,
          receiver_id: user?.id || "current-user",
          content:
            "This is a demo conversation. Connect to the backend to enable real-time chat.",
          sent_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          is_read: false,
          is_delivered: true,
        },
      ];

      setAllMessages(demoMessages);
      hasFetchedInitial.current = true;
      setHasMore(false);
    } else if (
      enabled &&
      otherUserId &&
      isConnected &&
      !hasFetchedInitial.current
    ) {
      loadInitialMessages();
    }
  }, [enabled, otherUserId, isConnected, loadInitialMessages, user?.id]);

  // Reset state when otherUserId changes
  useEffect(() => {
    setAllMessages([]);
    setOffset(0);
    setHasMore(true);
    hasFetchedInitial.current = false;
  }, [otherUserId]);

  // Merge WebSocket messages with existing messages
  useEffect(() => {
    if (wsMessages.length > 0) {
      setAllMessages((prev) => {
        const newMessages = wsMessages.filter(
          (wsMsg) => !prev.some((msg) => msg.id === wsMsg.id),
        );
        return [...prev, ...newMessages];
      });
    }
  }, [wsMessages]);

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
