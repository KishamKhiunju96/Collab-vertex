"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Trash2, User, Check, Sparkles, ChevronDown } from "lucide-react";
import { useUserData } from "@/api/hooks/useUserData";
import { useNotificationContext } from "@/context/NotificationContext";

export default function DashboardHeader() {
  const { user } = useUserData();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading,
  } = useNotificationContext();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
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

  const handleDeleteNotification = async (notifId: string) => {
    await deleteNotification(notifId);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border-subtle shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-5">
          {/* Welcome Message */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                {user?.username
                  ? `Welcome back, ${user.username}!`
                  : "Influencer Dashboard"}
              </h1>
              <p className="text-xs sm:text-sm text-text-muted hidden sm:block">
                Manage your collaborations and grow your influence
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2 sm:p-2.5 rounded-xl hover:bg-background-hoverFade transition-all duration-300 group"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary group-hover:text-brand-primary transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-accent to-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-border-subtle rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                  {/* Header */}
                  <div className="px-4 sm:px-6 py-4 border-b border-border-subtle bg-gradient-to-r from-background-hero to-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-text-primary text-lg">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <p className="text-xs text-text-muted mt-0.5">
                            You have {unreadCount} unread{" "}
                            {unreadCount === 1
                              ? "notification"
                              : "notifications"}
                          </p>
                        )}
                      </div>
                      {!loading && notifications.length > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-brand-primary/10"
                        >
                          <Check className="w-3 h-3" />
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                    {loading && (
                      <div className="p-8 text-center">
                        <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-text-muted text-sm">
                          Loading notifications...
                        </p>
                      </div>
                    )}

                    {!loading && notifications.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-hero flex items-center justify-center">
                          <Bell className="w-8 h-8 text-text-muted" />
                        </div>
                        <p className="text-text-muted font-medium">
                          No notifications yet
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          We&apos;ll notify you when something arrives
                        </p>
                      </div>
                    )}

                    {!loading &&
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`relative px-4 sm:px-6 py-4 border-b border-border-subtle/50 hover:bg-background-hero transition-all duration-300 group ${
                            !notif.is_read ? "bg-brand-primary/5" : ""
                          }`}
                        >
                          {!notif.is_read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary to-brand-accent" />
                          )}

                          <div className="flex items-start gap-3">
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleMarkNotification(notif.id)}
                            >
                              {/* Title */}
                              {notif.title && (
                                <h4 className="font-semibold text-text-primary text-sm mb-1 line-clamp-1">
                                  {notif.title}
                                </h4>
                              )}

                              {/* Message */}
                              <p className="text-text-secondary text-sm line-clamp-2 mb-2">
                                {notif.message}
                              </p>

                              {/* Timestamp and status */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-text-muted">
                                  {getTimeAgo(notif.created_at)}
                                </span>
                                {!notif.is_read && (
                                  <span className="flex items-center gap-1 text-xs text-brand-primary font-medium">
                                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                                    New
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notif.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-600 transition-all duration-300"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Footer */}
                  {!loading && notifications.length > 0 && (
                    <div className="px-4 sm:px-6 py-3 bg-background-hero border-t border-border-subtle">
                      <button className="w-full text-center text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-background-hoverFade transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-primary via-brand-accent to-brand-secondary flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow text-sm sm:text-base">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="font-semibold text-text-primary text-sm line-clamp-1">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-text-muted">Influencer</p>
                </div>
                <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-brand-primary transition-colors hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-border-subtle rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                  <div className="p-4 border-b border-border-subtle bg-gradient-to-r from-background-hero to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary via-brand-accent to-brand-secondary flex items-center justify-center text-white font-bold shadow-md">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary text-sm truncate">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/dashboard/influencerprofile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-background-hoverFade transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                        <User className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary text-sm">
                          My Profile
                        </p>
                        <p className="text-xs text-text-muted">
                          View and edit profile
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
