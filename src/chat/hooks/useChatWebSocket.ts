"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ChatMessage, SendMessagePayload } from "@/chat/types";
import { notify } from "@/utils/notify";

interface UseChatWebSocketProps {
  otherUserId: string; // IMPORTANT: Must be user_id (UUID), NOT profile id
  onMessageReceived?: (message: ChatMessage) => void;
  onConnectionChange?: (connected: boolean) => void;
}

interface UseChatWebSocketReturn {
  sendMessage: (content: string) => void;
  isConnected: boolean;
  messages: ChatMessage[];
  error: string | null;
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
 * Hook for managing WebSocket connection for real-time chat
 * Handles connection, reconnection, message sending/receiving
 */
export function useChatWebSocket({
  otherUserId,
  onMessageReceived,
  onConnectionChange,
}: UseChatWebSocketProps): UseChatWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;
  
  // Store callbacks in refs to prevent reconnection loops
  const onMessageReceivedRef = useRef(onMessageReceived);
  const onConnectionChangeRef = useRef(onConnectionChange);
  
  // Update refs when callbacks change
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
    onConnectionChangeRef.current = onConnectionChange;
  }, [onMessageReceived, onConnectionChange]);

  const connect = useCallback(() => {
    if (!otherUserId) {
      return;
    }

    // Don't create a new connection if one already exists
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.CONNECTING ||
        wsRef.current.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    try {
      //  CORRECT: wss://api.dixam.me/chat/ws/chat/{user_id}
      //  WRONG: wss://api.dixam.me/chat/ws/chat/{profile_id}
      const wsUrl = `${WS_BASE_URL}/chat/ws/chat/${otherUserId}`;

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
          const message: ChatMessage = JSON.parse(event.data);

          // Validate message object
          if (!message || typeof message !== 'object') {
            return;
          }

          // Validate required fields
          if (!message.sender_id || !message.receiver_id || !message.content) {
            return;
          }

          // Add message to local state
          setMessages((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            return [...safePrev, message];
          });

          // Call callback if provided
          onMessageReceivedRef.current?.(message);
        } catch (err) {
          setError("Failed to parse incoming message");
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        wsRef.current = null;
        onConnectionChangeRef.current?.(false);

        // Handle specific close codes
        if (event.code === 1008) {
          setError("Authentication failed. Please log in again.");
          notify.error("Chat authentication failed. Please refresh and log in again.");
          return;
        }

        // Attempt to reconnect if not closed intentionally
        if (
          event.code !== 1000 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
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
    } catch (err) {
      setError("Failed to create WebSocket connection");
    }
  }, [otherUserId]); // Only reconnect when otherUserId changes

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      // Close with code 1000 (normal closure) to prevent reconnection
      wsRef.current.close(1000, "Component unmounted");
      wsRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) {
      return;
    }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      notify.error("Chat is not connected. Please wait...");
      setError("WebSocket is not connected");
      return;
    }

    try {
      const payload: SendMessagePayload = { content };
      wsRef.current.send(JSON.stringify(payload));
    } catch (err) {
      setError("Failed to send message");
      notify.error("Failed to send message. Please try again.");
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    setError(null);
    setTimeout(() => connect(), 100);
  }, [connect, disconnect]);

  // Connect on mount and when otherUserId changes
  useEffect(() => {
    if (!otherUserId) {
      return;
    }

    connect();

    // Cleanup on unmount or when otherUserId changes
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId]); // Only reconnect when otherUserId changes

  return {
    sendMessage,
    isConnected,
    messages,
    error,
    reconnect,
  };
}
