"use client";

import { useEffect, useRef } from "react";
import { useNotificationContext } from "@/context/NotificationContext";
import { NotificationRead } from "@/types/notification";
import { BASE_URL, API_PATHS } from "@/api/apiPaths";

// Set to true to disable SSE notifications (useful for development if backend is not available)
const DISABLE_SSE_NOTIFICATIONS = false;

// Reconnection settings
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 seconds

export const useNotifications = () => {
  const { addNotification } = useNotificationContext();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const hasLoggedErrorRef = useRef(false);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    isUnmountedRef.current = false;

    // Skip SSE connection if disabled
    if (DISABLE_SSE_NOTIFICATIONS) {
      console.warn(
        "⚠️ SSE notifications are disabled. Set DISABLE_SSE_NOTIFICATIONS to false to enable.",
      );
      return;
    }

    let isConnecting = false;

    const connect = () => {
      // Don't connect if component is unmounted or already connecting
      if (
        isUnmountedRef.current ||
        isConnecting ||
        eventSourceRef.current?.readyState === EventSource.OPEN
      ) {
        return;
      }

      // Check if max reconnection attempts reached
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.warn(
          "⚠️ Max reconnection attempts reached. Notification stream disabled.",
        );
        return;
      }

      isConnecting = true;

      try {
        const sseUrl = `${BASE_URL}${API_PATHS.NOTIFICATION.STREAM}`;
        console.log("🔔 Connecting to notification stream:", sseUrl);

        const eventSource = new EventSource(sseUrl, {
          withCredentials: true, // Send cookies for authentication
        });

        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log("✅ Notification stream connected");
          isConnecting = false;
          reconnectAttemptsRef.current = 0; // Reset reconnection attempts on success
          hasLoggedErrorRef.current = false;

          // Clear any pending reconnection attempts
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        eventSource.onmessage = (event) => {
          try {
            const data: NotificationRead = JSON.parse(event.data);
            console.log("📬 Notification received:", data);

            // Add notification to context
            addNotification(data);
          } catch (error) {
            console.error("❌ Failed to parse notification:", error);
          }
        };

        eventSource.onerror = (error) => {
          isConnecting = false;

          // Only log detailed error once to avoid console spam
          if (!hasLoggedErrorRef.current) {
            console.warn(
              "⚠️ Notification stream connection error. Will retry...",
            );
            hasLoggedErrorRef.current = true;
          }

          // Close current connection
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }

          // Don't attempt reconnection if component is unmounted
          if (isUnmountedRef.current) {
            return;
          }

          // Increment reconnection attempts
          reconnectAttemptsRef.current += 1;

          // Attempt to reconnect after delay
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            console.log(
              `🔄 Reconnecting in ${RECONNECT_DELAY / 1000}s... (Attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`,
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              if (!isUnmountedRef.current) {
                connect();
              }
            }, RECONNECT_DELAY);
          } else {
            console.error(
              "❌ Failed to connect to notification stream after multiple attempts",
            );
          }
        };

        // Handle specific event types if backend sends them
        eventSource.addEventListener("notification", (event: MessageEvent) => {
          try {
            const data: NotificationRead = JSON.parse(event.data);
            console.log("📬 Custom notification event received:", data);
            addNotification(data);
          } catch (error) {
            console.error("❌ Failed to parse custom notification:", error);
          }
        });
      } catch (error) {
        console.error("❌ Failed to create SSE connection:", error);
        isConnecting = false;

        // Attempt reconnection
        if (
          !isUnmountedRef.current &&
          reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS
        ) {
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              connect();
            }
          }, RECONNECT_DELAY);
        }
      }
    };

    // Initial connection attempt
    connect();

    // Cleanup function
    return () => {
      isUnmountedRef.current = true;

      // Clear reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Close SSE connection
      if (eventSourceRef.current) {
        console.log("🔌 Closing notification stream");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [addNotification]);
};
