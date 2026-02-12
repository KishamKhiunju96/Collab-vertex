"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useUserData } from "@/api/hooks/useUserData";
import { useNotificationContext } from "@/context/NotificationContext";

export default function DashboardHeader() {
  const { user } = useUserData();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } =
    useNotificationContext();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // -----------------------------
  // Close dropdown when clicking outside
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkNotification = (notifId: string) => {
    markAsRead(notifId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md relative z-50">
      {/* Welcome Message */}
      <h1 className="text-2xl font-bold text-gray-900">
        Hi!{" "}
        {user?.username
          ? `${user.username}, welcome to Collab-vertex 👋`
          : "Influencer"}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setIsNotifOpen((prev) => !prev)}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
              {/* Header with Mark All as Read */}
              {!loading && notifications.length > 0 && (
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Notifications
                  </span>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all as read
                  </button>
                </div>
              )}

              {/* Scrollable notification list */}
              <div className="overflow-y-auto max-h-80">
                {loading && (
                  <div className="p-4 text-gray-500 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mx-auto mb-2"></div>
                    Loading notifications...
                  </div>
                )}

                {!loading && notifications.length === 0 && (
                  <div className="p-4 text-gray-500 text-center">
                    No notifications yet
                  </div>
                )}

                {!loading &&
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition ${
                        !notif.is_read
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                      onClick={() => handleMarkNotification(notif.id)}
                      title="Click to mark as read"
                    >
                      {/* Notification Title */}
                      {notif.title && (
                        <p className="font-semibold text-gray-900 mb-1">
                          {notif.title}
                        </p>
                      )}

                      {/* Notification Message */}
                      <p className="text-gray-700 text-sm">{notif.message}</p>

                      {/* Notification Timestamp */}
                      <small className="text-gray-400 text-xs mt-1 block">
                        {new Date(notif.created_at).toLocaleString()}
                      </small>

                      {/* Unread Indicator */}
                      {!notif.is_read && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-blue-600">New</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <Link
          href="/dashboard/influencerprofile"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="font-medium text-gray-700">Profile</span>
        </Link>
      </div>
    </header>
  );
}
