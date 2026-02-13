"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { NotificationRead } from "@/types/notification";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/api/services/notificationService";
import { useNotifications } from "@/api/hooks/useNotifications";
import { useUser } from "./UserContext";

interface NotificationContextProps {
  notifications: NotificationRead[];
  unreadCount: number;
  addNotification: (notification: NotificationRead) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refetchNotifications: () => Promise<void>;
  reconnectStream: () => void;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: userLoading } = useUser();
  const [notifications, setNotifications] = useState<NotificationRead[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Add new notification (from SSE stream) - defined before useNotifications
  const addNotification = useCallback((notification: NotificationRead) => {
    setNotifications((prev) => {
      // Check if notification already exists
      const exists = prev.some((n) => n.id === notification.id);
      if (exists) return prev;

      // Add new notification at the beginning
      return [notification, ...prev];
    });

    // Increment unread count if notification is unread
    if (!notification.is_read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  // Initialize SSE connection and get controls - pass addNotification callback
  // Only connect if user is authenticated
  const sseControls = useNotifications(addNotification, !!user);

  // Fetch initial notifications from API
  const loadNotifications = useCallback(async () => {
    // Don't fetch if user is not authenticated
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);

      // Calculate unread count from notifications
      const unread = data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Don't show error to user, just log it
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load notifications only when user is authenticated
  useEffect(() => {
    if (!userLoading && user) {
      loadNotifications();
    } else if (!userLoading && !user) {
      setLoading(false);
      setNotifications([]);
      setUnreadCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );

      // Decrement unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Call API to mark as read (PATCH)
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);

      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)),
      );

      // Increment unread count back
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Optimistically update UI
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);

      // Call API to mark all as read (POST)
      await markAllNotificationsAsRead();

      // Refetch notifications from REST API to ensure sync
      await loadNotifications();

      // Reconnect SSE stream to get fresh stream
      console.log("🔄 Reconnecting notification stream after mark all as read");
      sseControls.reconnect();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);

      // Reload notifications to get correct state
      await loadNotifications();
    }
  }, [loadNotifications, sseControls]);

  // Refetch notifications manually
  const refetchNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  // Delete notification
  const deleteNotificationHandler = useCallback(
    async (id: string) => {
      try {
        // Find the notification to check if it was unread
        const notificationToDelete = notifications.find((n) => n.id === id);
        const wasUnread = notificationToDelete && !notificationToDelete.is_read;

        // Optimistically remove from UI
        setNotifications((prev) => prev.filter((n) => n.id !== id));

        // Decrement unread count if it was unread
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        // Call API to delete
        await deleteNotification(id);
      } catch (error) {
        console.error("Failed to delete notification:", error);

        // Reload notifications to restore correct state
        await loadNotifications();
      }
    },
    [notifications, loadNotifications],
  );

  // Expose reconnect stream function
  const reconnectStream = useCallback(() => {
    console.log("🔄 Manual stream reconnection triggered");
    sseControls.reconnect();
  }, [sseControls]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification: deleteNotificationHandler,
        refetchNotifications,
        reconnectStream,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  return context;
};
