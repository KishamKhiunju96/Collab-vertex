"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ChatMessage, SendMessagePayload } from "@/chat/types";
import { notify } from "@/utils/notify";

interface UseChatWebSocketProps {
  otherUserId: string;
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

// Development mode flag - disable WebSocket in development if backend is not available
const isDevelopment = process.env.NODE_ENV === "development";
const disableWebSocket = isDevelopment && !process.env.NEXT_PUBLIC_WS_URL;

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
  const connectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    if (!otherUserId) {
      console.warn("Cannot connect: otherUserId is required");
      return;
    }

    // Skip WebSocket connection in development if disabled
    if (disableWebSocket) {
      console.log(
        "WebSocket disabled in development mode (no backend available)",
      );
      setIsConnected(false);
      setError(null); // Don't show error in dev mode when disabled
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
      const wsUrl = `${WS_BASE_URL}/ws/chat/${otherUserId}`;
      console.log("Connecting to WebSocket:", wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        onConnectionChange?.(true);
      };

      ws.onmessage = (event) => {
        try {
          const message: ChatMessage = JSON.parse(event.data);
          console.log("Message received:", message);

          // Add message to local state
          setMessages((prev) => [...prev, message]);

          // Call callback if provided
          onMessageReceived?.(message);
        } catch (err) {
          console.error("Failed to parse message:", err);
          setError("Failed to parse incoming message");
        }
      };

      ws.onerror = (event) => {
        // Only log error if not in disabled development mode
        if (!disableWebSocket) {
          console.error("WebSocket error:", event);
          setError("WebSocket connection error");
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        onConnectionChange?.(false);

        // Attempt to reconnect if not closed intentionally
        if (
          event.code !== 1000 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connectRef.current?.();
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError("Failed to connect after multiple attempts");
          notify.error("Chat connection lost. Please refresh the page.");
        }
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setError("Failed to create WebSocket connection");
    }
  }, [otherUserId, onMessageReceived, onConnectionChange]);

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
      console.warn("Cannot send empty message");
      return;
    }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      notify.error("Chat is not connected. Please wait...");
      setError("WebSocket is not connected");
      return;
    }

    try {
      const payload: SendMessagePayload = { content };
      wsRef.current.send(JSON.stringify(payload));
      console.log("Message sent:", payload);
    } catch (err) {
      console.error("Failed to send message:", err);
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

  // Update connectRef when connect changes
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // Connect on mount and when otherUserId changes
  useEffect(() => {
    // Intentionally calling connect here to establish WebSocket connection
    // This is the correct pattern for initializing external system connections
    const initConnection = () => {
      connect();
    };

    initConnection();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    isConnected,
    messages,
    error,
    reconnect,
  };
}
