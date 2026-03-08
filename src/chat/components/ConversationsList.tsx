"use client";

import React from "react";
import { Conversation } from "@/chat/types";
import { Users, User } from "lucide-react";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { useChatStore } from "@/chat/store/chatStore";

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
  const isUserOnline = useChatStore((state) => state.isUserOnline);
  
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No conversations yet
          </h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Start a conversation from the "New Chat" tab
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-white">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedConversationId;
        const isGroup = conversation.type === "GROUP";

        // ✅ FIXED: Use conversation.name directly from backend
        // Backend already sets:
        // - For GROUP: name = group name (e.g., "Influencers")
        // - For DIRECT: name = other person's username (e.g., "queen", "queen1")
        let displayName = conversation.name || "Unknown";
        
        // Fallback: If no name, try to get from participants (shouldn't happen)
        if (!displayName || displayName === "Unknown") {
          if (isGroup) {
            displayName = "Unnamed Group";
          } else {
            const participants = conversation.participants || [];
            const otherParticipant = participants.length > 0 ? participants[0] : null;
            displayName = otherParticipant?.username || "Unknown User";
          }
        }

        const avatarUrl = conversation.avatar_url || "";
        const lastMessagePreview = conversation.last_message?.content || "No messages yet";
        
        // Check if the other user is online (for direct chats only)
        let isOtherUserOnline = false;
        if (!isGroup && conversation.participant_ids && conversation.participant_ids.length > 0) {
          // Check online status for participants
          isOtherUserOnline = conversation.participant_ids.some(userId => isUserOnline(userId));
        }
        
        // Show "Online" if user is online, otherwise show timestamp
        let lastMessageTime = "";
        if (!isGroup && isOtherUserOnline) {
          lastMessageTime = "Online";
        } else if (conversation.last_message?.sent_at || conversation.last_message?.timestamp) {
          lastMessageTime = formatTimestamp(conversation.last_message.sent_at || conversation.last_message.timestamp);
        }

        const unreadCount = conversation.unread_count || 0;

        return (
          <button
            key={conversation.id}
            onClick={() => onConversationSelect(conversation)}
            className={`
              w-full px-4 py-3 flex items-center gap-3 transition-all duration-150
              hover:bg-gray-50 border-b border-gray-100 last:border-b-0
              ${
                isSelected
                  ? "bg-gray-50"
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
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                  {isGroup ? (
                    <Users className="w-6 h-6" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
              )}

              {/* Online indicator - only show for direct chats */}
              {!isGroup && isOtherUserOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
              )}

              {/* Unread badge */}
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              {/* Name and time */}
              <div className="flex items-center justify-between mb-1">
                <h3
                  className={`text-sm font-semibold truncate ${
                    unreadCount > 0
                      ? "text-gray-900"
                      : "text-gray-900"
                  }`}
                >
                  {displayName}
                </h3>
                {lastMessageTime && (
                  <span className={`text-xs ml-2 flex-shrink-0 ${isOtherUserOnline && !isGroup ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
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
 * Format timestamp to relative time (converts UTC to local timezone)
 * Uses date-fns for accurate timezone conversion and formatting
 */
function formatTimestamp(timestamp: string): string {
  // Backend sends timestamps WITHOUT 'Z' suffix, but they ARE UTC
  // Add 'Z' to explicitly mark as UTC so JavaScript converts correctly
  const utcTimestamp = timestamp.endsWith('Z') ? timestamp : timestamp + 'Z';
  const date = new Date(utcTimestamp);
  
  if (isNaN(date.getTime())) return "";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // For messages within last 24 hours, show relative time
  if (diffHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  // For today/yesterday
  if (isToday(date)) {
    return format(date, "h:mm a");
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  
  // For older messages, show date
  return format(date, "MMM d");
}
