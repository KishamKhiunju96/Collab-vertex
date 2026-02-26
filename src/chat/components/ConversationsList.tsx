"use client";

import React from "react";
import { Conversation } from "@/chat/types";
import { Users, User } from "lucide-react";

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onConversationSelect: (conversation: Conversation) => void;
  loading?: boolean;
}

export function ConversationsList({
  conversations,
  selectedConversationId,
  onConversationSelect,
  loading = false,
}: ConversationsListProps) {
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No conversations yet
          </h3>
          <p className="text-sm text-gray-500">
            Start a conversation by clicking on a user
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedConversationId;
        const isGroup = conversation.type === "GROUP";

        // Get display name and avatar
        let displayName = "";
        let avatarUrl = "";

        if (isGroup) {
          displayName = conversation.name || "Unnamed Group";
          avatarUrl = conversation.avatar_url || "";
        } else {
          // For direct conversations, show the other participant
          const participants = conversation.participants || [];
          const otherParticipant = participants.length > 0 ? participants[0] : null;
          displayName = otherParticipant?.username || conversation.name || "Unknown User";
          avatarUrl = ""; // No avatar_url in participant type
        }

        const lastMessagePreview = conversation.last_message?.content || "No messages yet";
        const lastMessageTime = conversation.last_message?.timestamp || conversation.last_message?.created_at
          ? formatTimestamp(conversation.last_message.timestamp || conversation.last_message.created_at)
          : "";

        const unreadCount = conversation.unread_count || 0;

        return (
          <button
            key={conversation.id}
            onClick={() => onConversationSelect(conversation)}
            className={`
              w-full p-4 flex items-start gap-3 transition-all duration-200
              border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50
              ${
                isSelected
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-l-purple-500"
                  : ""
              }
            `}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shadow-md">
                  {isGroup ? (
                    <Users className="w-6 h-6" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
              )}

              {/* Unread badge */}
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              {/* Name and time */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  className={`font-semibold truncate ${
                    unreadCount > 0
                      ? "text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  {displayName}
                  {isGroup && (
                    <span className="text-xs text-gray-500 ml-2">
                      ({conversation.participants?.length || 0} members)
                    </span>
                  )}
                </h3>
                {lastMessageTime && (
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {lastMessageTime}
                  </span>
                )}
              </div>

              {/* Last message preview */}
              <p
                className={`text-sm truncate ${
                  unreadCount > 0
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                }`}
              >
                {lastMessagePreview}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Format timestamp to relative time
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // For older messages, show date
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
}
