"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ConversationMessage, SendMessagePayload } from "@/chat/types";
import { notify } from "@/utils/notify";

interface UseConversationWebSocketProps {
  conversationId: string;
  onMessageReceived?: (message: ConversationMessage | any) => void;
  onConnectionChange?: (connected: boolean) => void;
  autoConnect?: boolean; // Whether to connect automatically
}

interface UseConversationWebSocketReturn {
  sendMessage: (content: string, type?: 'TEXT' | 'IMAGE' | 'FILE') => void;
  sendTypingIndicator: (isTyping: boolean) => void;
  markAsRead: () => void;
  isConnected: boolean;
  messages: ConversationMessage[];
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  (typeof window !== "undefined"
    ? window.location.protocol === "https:"
      ? "wss://api.dixam.me"
      : "ws://api.dixam.me"
    : "wss://api.dixam.me");

/**
 * Hook for managing WebSocket connection for conversation-based real-time chat
 * Handles connection, reconnection, message sending/receiving
 * 
 * IMPORTANT: WebSocket Authentication
 * - The WebSocket connection uses HttpOnly cookies for authentication (same as REST API)
 * - Cookies are automatically sent by the browser with WebSocket connections
 * - Make sure user is logged in before connecting
 * 
 * Connection Flow:
 * 1. User clicks on a contact/brand/influencer
 * 2. CREATE_DIRECT_CONVERSATION API is called with other_user_id
 * 3. Backend creates/returns conversation with conversation_id
 * 4. This hook connects to: wss://api.dixam.me/ws/chat/conversation/{conversation_id}
 * 5. Backend validates the user's session cookie
 * 6. If valid, WebSocket connection is established
 * 7. Both users in the conversation can now send/receive real-time messages
 * 
 * Usage:
 * const { sendMessage, isConnected, messages } = useConversationWebSocket({
 *   conversationId: "conversation-uuid",
 *   onMessageReceived: (msg) => console.log(msg),
 *   autoConnect: true
 * });
 */
export function useConversationWebSocket({
  conversationId,
  onMessageReceived,
  onConnectionChange,
  autoConnect = false,
}: UseConversationWebSocketProps): UseConversationWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;
  const shouldConnectRef = useRef(autoConnect);
  
  // Store callbacks in refs to prevent reconnection loops
  const onMessageReceivedRef = useRef(onMessageReceived);
  const onConnectionChangeRef = useRef(onConnectionChange);
  
  // Update refs when callbacks change
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
    onConnectionChangeRef.current = onConnectionChange;
  }, [onMessageReceived, onConnectionChange]);

  const connect = useCallback(() => {
    if (!conversationId) {
      setError("No conversation ID provided");
      return;
    }

    shouldConnectRef.current = true;

    // Don't create a new connection if one already exists
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.CONNECTING ||
        wsRef.current.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    try {
      // Construct WebSocket URL for conversation
      // Path matches API_PATHS.CHAT.WEBSOCKET: /chat/ws/conversation/{conversation_id}
      const wsUrl = `${WS_BASE_URL}/chat/ws/conversation/${conversationId}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        onConnectionChangeRef.current?.(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Call callback for all message types
          onMessageReceivedRef.current?.(data);

          // Only add to messages array if it's an actual chat message
          if (data.type === "message" || !data.type || data.content) {
            const message: ConversationMessage = data;
            setMessages((prev) => [...prev, message]);
          }
          // For typing, read_receipt, status_update - just pass to callback, don't add to messages
        } catch (error) {
          // Failed to parse WebSocket message
        }
      };

      ws.onerror = (event) => {
        setError("Connection error occurred");
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        onConnectionChangeRef.current?.(false);

        // Only attempt to reconnect if we should still be connected
        if (
          shouldConnectRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts &&
          event.code !== 1000 // Don't reconnect if it was a clean close
        ) {
          reconnectAttemptsRef.current += 1;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError("Failed to connect after multiple attempts");
          notify.error("Chat connection lost. Please refresh the page.");
        }
      };
    } catch (error) {
      setError("Failed to establish connection");
    }
  }, [conversationId]);

  const disconnect = useCallback(() => {
    shouldConnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected");
      wsRef.current = null;
    }

    setIsConnected(false);
    setError(null);
  }, [conversationId]);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    setTimeout(() => {
      connect();
    }, 500);
  }, [connect, disconnect]);

  const sendMessage = useCallback(
    (content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT') => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        notify.error("Not connected to chat. Please try again.");
        return;
      }

      if (!content.trim()) {
        return;
      }

      try {
        // Backend expects: { type: "message", content: "...", message_type: "TEXT" }
        const payload = {
          type: "message",
          content: content.trim(),
          message_type: type,
        };
        
        wsRef.current.send(JSON.stringify(payload));
      } catch (error) {
        notify.error("Failed to send message");
      }
    },
    []
  );

  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        return;
      }

      try {
        const payload = {
          type: "typing",
          is_typing: isTyping,
        };

        wsRef.current.send(JSON.stringify(payload));
      } catch (error) {
        // Failed to send typing indicator
      }
    },
    []
  );

  const markAsRead = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      const payload = {
        type: "read",
      };

      wsRef.current.send(JSON.stringify(payload));
    } catch (error) {
      // Failed to send read receipt
    }
  }, []);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (!isConnected || !wsRef.current) return;

    const heartbeatInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: "heartbeat" }));
        } catch (error) {
          // Failed to send heartbeat
        }
      }
    }, 30000); // Send heartbeat every 30 seconds

    return () => clearInterval(heartbeatInterval);
  }, [isConnected]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && conversationId) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [conversationId, autoConnect]); // Only re-run if conversationId or autoConnect changes

  return {
    sendMessage,
    sendTypingIndicator,
    markAsRead,
    isConnected,
    messages,
    error,
    connect,
    disconnect,
    reconnect,
  };
}
