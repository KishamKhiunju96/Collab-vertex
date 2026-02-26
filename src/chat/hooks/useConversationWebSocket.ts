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
    console.log("=== useConversationWebSocket.connect ===");
    console.log("Conversation ID:", conversationId);
    
    if (!conversationId) {
      console.warn("Cannot connect: conversationId is required");
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
      console.log("WebSocket connection already exists, skipping");
      return;
    }

    try {
      // Construct WebSocket URL for conversation
      // Path matches API_PATHS.CHAT.WEBSOCKET: /chat/ws/conversation/{conversation_id}
      const wsUrl = `${WS_BASE_URL}/chat/ws/conversation/${conversationId}`;
      
      console.log("=== WebSocket Connection Details ===");
      console.log("Base URL:", WS_BASE_URL);
      console.log("Conversation ID:", conversationId);
      console.log("Full WebSocket URL:", wsUrl);
      console.log("Expected Backend Path: /chat/ws/conversation/{id}");
      console.log("Authentication: HttpOnly cookies (automatic)");
      console.log("====================================");

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected to conversation:", conversationId);
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        onConnectionChangeRef.current?.(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("=== WebSocket Message Received ===");
          console.log("Type:", data.type || 'message');
          
          if (data.content) {
            console.log("📨 Message data:", {
              id: data.id,
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              content: data.content?.substring(0, 30) + '...',
              sender_id_type: typeof data.sender_id,
              full_data: data,
            });
          }
          console.log("=================================");

          // Call callback for all message types
          onMessageReceivedRef.current?.(data);

          // Only add to messages array if it's an actual chat message
          if (data.type === "message" || !data.type || data.content) {
            const message: ConversationMessage = data;
            console.log("💾 Adding message to array:", {
              id: message.id,
              sender_id: message.sender_id,
              content: message.content?.substring(0, 20),
            });
            setMessages((prev) => [...prev, message]);
          }
          // For typing, read_receipt, status_update - just pass to callback, don't add to messages
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
          console.error("Raw message:", event.data);
        }
      };

      ws.onerror = (event) => {
        setError("Connection error occurred");
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });

        setIsConnected(false);
        onConnectionChangeRef.current?.(false);

        // Only attempt to reconnect if we should still be connected
        if (
          shouldConnectRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts &&
          event.code !== 1000 // Don't reconnect if it was a clean close
        ) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError("Failed to connect after multiple attempts");
          notify.error("Chat connection lost. Please refresh the page.");
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setError("Failed to establish connection");
    }
  }, [conversationId]);

  const disconnect = useCallback(() => {
    console.log("Disconnecting WebSocket for conversation:", conversationId);
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
    console.log("Manual reconnection requested");
    disconnect();
    reconnectAttemptsRef.current = 0;
    setTimeout(() => {
      connect();
    }, 500);
  }, [connect, disconnect]);

  const sendMessage = useCallback(
    (content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT') => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn("Cannot send message: WebSocket not connected");
        notify.error("Not connected to chat. Please try again.");
        return;
      }

      if (!content.trim()) {
        console.warn("Cannot send empty message");
        return;
      }

      try {
        // Backend expects: { type: "message", content: "...", message_type: "TEXT" }
        const payload = {
          type: "message",
          content: content.trim(),
          message_type: type,
        };

        console.log("=== Sending Message ===");
        console.log("Payload:", JSON.stringify(payload, null, 2));
        console.log("======================");
        
        wsRef.current.send(JSON.stringify(payload));
      } catch (error) {
        console.error("Failed to send message:", error);
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

        console.log("📝 Sending typing indicator:", isTyping);
        wsRef.current.send(JSON.stringify(payload));
      } catch (error) {
        console.error("Failed to send typing indicator:", error);
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

      console.log("✅ Marking conversation as read");
      wsRef.current.send(JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to send read receipt:", error);
    }
  }, []);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (!isConnected || !wsRef.current) return;

    const heartbeatInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: "heartbeat" }));
          console.log("💓 Heartbeat sent");
        } catch (error) {
          console.error("Failed to send heartbeat:", error);
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
