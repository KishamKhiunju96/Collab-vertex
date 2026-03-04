"use client";

import { useState } from "react";
import { Conversation } from "@/chat/types";
import { useConversations } from "@/chat/hooks/useConversationsList";
import { ConversationsList } from "./ConversationsList";
import ConversationChatRoom from "./ConversationChatRoom";
import ChatContactsList from "./ChatContactsList";
import GroupChatCreator from "./GroupChatCreator";
import { X, MessageSquarePlus, Users, User, ArrowLeft, Loader2, Plus } from "lucide-react";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline?: boolean;
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
  } = useConversations();

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
      const participantCount = conversation.participants?.length || 0;
      return {
        name: conversation.name || "Unnamed Group",
        subtitle: `${participantCount} members`,
        isGroup: true,
      };
    } else {
      const participants = conversation.participants || [];
      const otherParticipant =
        participants.length > 0 ? participants[0] : null;
      return {
        name:
          otherParticipant?.username ||
          conversation.name ||
          "Unknown User",
        subtitle: otherParticipant?.email || "",
        isGroup: false,
      };
    }
  };

  return (
    <div className=" h-full bg-white flex overflow-hidden">
      {/* Left Sidebar - Contact List (EXACTLY 256px like dashboard sidebar) */}
      <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'}  flex-col border-r border-gray-200 bg-white flex-shrink-0`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <div className="flex items-center gap-2">
            {view === "conversations" && (
              <button
                onClick={() => setView("group-creator")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Create group"
                title="Create group chat"
              >
                <MessageSquarePlus size={20} className="text-gray-700" />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} className="text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full border-b border-gray-200 bg-white px-4">
          <button
            onClick={() => setView("conversations")}
            className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
              view === "conversations"
                ? "text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Conversations
            {view === "conversations" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setView("contacts")}
            className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
              view === "contacts"
                ? "text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Contacts
            {view === "contacts" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
        </div>

        {error && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-sm text-yellow-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>
              Unable to load conversation history. You can still start new
              chats.
            </span>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
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
            <div className="h-full overflow-y-auto bg-white">
              {isCreatingConversation ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    <p className="text-sm text-gray-500">
                      Creating conversation...
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-all duration-150 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                          {contact.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        {contact.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {contact.username}
                          </h3>
                          {contact.role && (
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.email || 'Start a conversation...'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Room */}
      <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'} flex-1 flex-col min-w-0 bg-gray-50`}>
        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToList}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-all"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} className="text-gray-700" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {getConversationDisplayInfo(selectedConversation).isGroup ? (
                      <Users size={20} />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {getConversationDisplayInfo(selectedConversation).name}
                    </h2>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Active now
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <ConversationChatRoom
              conversation={selectedConversation}
              onMarkAsRead={handleMarkAsRead}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center px-6 max-w-sm">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-gray-900 flex items-center justify-center">
                <MessageSquarePlus className="w-12 h-12 text-gray-900" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Your Messages
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Send private messages to your contacts
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}