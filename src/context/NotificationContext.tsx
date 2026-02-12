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
  fetchUnreadCount,
} from "@/api/services/notificationService";

interface NotificationContextProps {
  notifications: NotificationRead[];
  unreadCount: number;
  addNotification: (notification: NotificationRead) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => Promise<void>;
  refetchNotifications: () => Promise<void>;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationRead[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial notifications from API
  const loadNotifications = useCallback(async () => {
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
  }, []);

  // Load notifications on mount - only once
  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Add new notification (from SSE stream)
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
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);

      // Reload notifications to get correct state
      await loadNotifications();
    }
  }, [loadNotifications]);

  // Refetch notifications manually
  const refetchNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        refetchNotifications,
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
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  return context;
};
