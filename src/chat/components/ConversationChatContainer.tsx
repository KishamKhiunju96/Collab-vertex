"use client";

import { useState, useMemo } from "react";
import { Conversation } from "@/chat/types";
import { useConversations } from "@/chat/hooks/useConversationsList";
import { ConversationsList } from "./ConversationsList";
import ConversationChatRoom from "./ConversationChatRoom";
import ChatContactsList from "./ChatContactsList";
import GroupChatCreator from "./GroupChatCreator";
import { X, MessageSquarePlus, Users, User, ArrowLeft, Loader2, Plus, Phone, Video, Info } from "lucide-react";
import { useChatStore } from "@/chat/store/chatStore";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline?: boolean;
  lastMessageTime?: string;
}

interface ConversationChatContainerProps {
  contacts: ChatContact[];
  onClose?: () => void;
  isLoadingContacts?: boolean;
}

export default function ConversationChatContainer({
  contacts,
  onClose,
  isLoadingContacts = false,
}: ConversationChatContainerProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [view, setView] = useState<
    "conversations" | "contacts" | "group-creator"
  >("conversations");
  const [isCreatingConversation, setIsCreatingConversation] =
    useState(false);

  const {
    conversations,
    loading,
    error,
    refresh,
    getOrCreateDirectConversation,
    createGroupConversation,
    updateConversationMessage,
  } = useConversations();

  const isUserOnline = useChatStore((state) => state.isUserOnline);

  const enrichedContacts = useMemo(() => {
    if (!contacts || contacts.length === 0) return [];

    return contacts.map((contact) => {
      const existingConversation = conversations.find(
        (conv) =>
          conv.type === "DIRECT" &&
          conv.participant_ids?.includes(contact.id)
      );

      const isOnline = isUserOnline(contact.id);

      if (existingConversation) {
        return {
          ...contact,
          lastMessage: existingConversation.last_message?.content,
          unreadCount: existingConversation.unread_count || 0,
          lastMessageTime: existingConversation.last_message?.sent_at,
          isOnline,
        };
      }

      return {
        ...contact,
        isOnline,
      };
    });
  }, [contacts, conversations, isUserOnline]);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleMarkAsRead = () => {
    // Conversation marked as read via WebSocket
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleContactSelect = async (contact: ChatContact) => {
    setIsCreatingConversation(true);
    try {
      const conversation = await getOrCreateDirectConversation(contact.id);

      if (conversation) {
        if (
          !conversation.participants ||
          conversation.participants.length === 0
        ) {
          conversation.participants = [
            {
              id: contact.id,
              username: contact.username,
              email: contact.email,
              role: contact.role,
            },
          ];
        }

        if (!conversation.name && conversation.type === "DIRECT") {
          conversation.name = contact.username;
        }

        setSelectedConversation(conversation);
        setView("conversations");
      }
    } catch (err) {
      // Failed to create conversation
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleCreateGroup = async (
    name: string,
    participantIds: string[],
    description?: string
  ) => {
    setIsCreatingConversation(true);
    try {
      const conversation = await createGroupConversation(
        name,
        participantIds,
        description
      );

      if (conversation) {
        setSelectedConversation(conversation);
        setView("conversations");
      }
    } catch (err) {
      // Failed to create group
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const getConversationDisplayInfo = (conversation: Conversation) => {
    if (conversation.type === "GROUP") {
      const participantCount =
        conversation.participants?.length ||
        conversation.participant_ids?.length ||
        0;
      return {
        name: conversation.name || "Unnamed Group",
        subtitle: `${participantCount} members`,
        isGroup: true,
      };
    } else {
      const displayName = conversation.name || "Unknown User";

      const participants = conversation.participants || [];
      const otherParticipant = participants.find((p) =>
        conversation.participant_ids?.includes(p.id)
      );

      return {
        name: displayName,
        subtitle: otherParticipant?.email || otherParticipant?.role || "",
        isGroup: false,
      };
    }
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* Left Sidebar - Contact List */}
      <div
        className={`${
          selectedConversation ? "hidden lg:flex" : "flex"
        } w-80 flex-col border-r border-gray-200 bg-white`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <div className="flex items-center gap-1">
            {view === "conversations" && (
              <button
                onClick={() => setView("group-creator")}
                className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                aria-label="Create group"
                title="Create group chat"
              >
                <MessageSquarePlus size={20} />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full px-4 py-2 pl-10 bg-gray-100 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100 px-4 bg-white">
          <button
            onClick={() => setView("conversations")}
            className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 ${
              view === "conversations"
                ? "text-gray-900 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setView("contacts")}
            className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 ${
              view === "contacts"
                ? "text-gray-900 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Contacts
          </button>
        </div>

        {error && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-sm text-yellow-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>Unable to load messages</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {view === "group-creator" ? (
            <GroupChatCreator
              contacts={contacts}
              onCreateGroup={handleCreateGroup}
              onCancel={() => setView("conversations")}
              isCreating={isCreatingConversation}
            />
          ) : view === "conversations" ? (
            <ConversationsList
              conversations={conversations}
              selectedConversationId={selectedConversation?.id || null}
              onConversationSelect={handleConversationSelect}
              loading={loading}
            />
          ) : (
            <div className="flex-1 overflow-y-auto">
              {isCreatingConversation ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-sm text-gray-500">
                      Creating conversation...
                    </p>
                  </div>
                </div>
              ) : enrichedContacts.length === 0 ? (
                <div className="h-full flex items-center justify-center px-4">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">No contacts available</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {enrichedContacts.map((contact) => {
                    const hasUnread = (contact.unreadCount || 0) > 0;

                    return (
                      <button
                        key={contact.id}
                        onClick={() => handleContactSelect(contact)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150 text-left"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                            {contact.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          {contact.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3
                              className={`text-sm font-medium truncate ${
                                hasUnread
                                  ? "text-gray-900 font-semibold"
                                  : "text-gray-900"
                              }`}
                            >
                              {contact.username}
                            </h3>
                            {contact.lastMessageTime && (
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {formatTimestamp(contact.lastMessageTime)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-xs truncate ${
                                hasUnread
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {contact.lastMessage ||
                                contact.email ||
                                "No messages yet"}
                            </p>
                            {hasUnread && (
                              <span className="flex-shrink-0 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                {contact.unreadCount! > 99
                                  ? "99+"
                                  : contact.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Room */}
      <div
        className={`${
          selectedConversation ? "flex" : "hidden lg:flex"
        } flex-1 flex-col min-w-0 bg-white`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={handleBackToList}
                  className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {getConversationDisplayInfo(selectedConversation)
                      .isGroup ? (
                      <Users size={20} />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 truncate">
                      {
                        getConversationDisplayInfo(selectedConversation)
                          .name
                      }
                    </h2>
                    <p className="text-xs text-gray-500">
                      {getConversationDisplayInfo(selectedConversation)
                        .subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                  title="Call"
                >
                  <Phone size={20} />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                  title="Video call"
                >
                  <Video size={20} />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                  title="Conversation info"
                >
                  <Info size={20} />
                </button>
              </div>
            </div>

            {/* Chat Room */}
            <ConversationChatRoom
              conversation={selectedConversation}
              onMarkAsRead={handleMarkAsRead}
              onMessageSent={(message) => {
                updateConversationMessage(selectedConversation.id, message);
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center px-6 max-w-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageSquarePlus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-500">
                Choose a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Format timestamp to relative time (converts UTC to local timezone)
 */
function formatTimestamp(timestamp: string): string {
  const utcTimestamp = timestamp.endsWith("Z") ? timestamp : timestamp + "Z";
  const date = new Date(utcTimestamp);

  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  const diffHours = diffMs / (1000 * 60 * 60);

  // Less than 1 minute
  if (diffMinutes < 1) {
    return "now";
  }

  // Less than 1 hour
  if (diffHours < 1) {
    const minutes = Math.floor(diffMinutes);
    return `${minutes}m ago`;
  }

  // Less than 24 hours
  if (diffHours < 24) {
    return format(date, "h:mm a");
  }

  // Yesterday
  if (isYesterday(date)) {
    return "yesterday";
  }

  // Today
  if (isToday(date)) {
    return format(date, "h:mm a");
  }

  // Older
  return format(date, "MMM d");
}