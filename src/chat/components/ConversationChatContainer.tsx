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
    console.log("Conversation marked as read via WebSocket");
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleContactSelect = async (contact: ChatContact) => {
    setIsCreatingConversation(true);
    try {
      console.log("Creating/finding conversation with user:", contact.id);
      const conversation = await getOrCreateDirectConversation(contact.id);

      if (conversation) {
        if (
          !conversation.participants ||
          conversation.participants.length === 0
        ) {
          console.log(
            "⚠️ Conversation has no participants, enriching with contact data"
          );
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

        console.log("✅ Conversation ready:", {
          id: conversation.id,
          name: conversation.name,
          participants: conversation.participants,
        });

        setSelectedConversation(conversation);
        setView("conversations");
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
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
      console.log("Creating group:", { name, participantIds, description });
      const conversation = await createGroupConversation(
        name,
        participantIds,
        description
      );

      if (conversation) {
        console.log("✅ Group created:", conversation);
        setSelectedConversation(conversation);
        setView("conversations");
      }
    } catch (err) {
      console.error("Failed to create group:", err);
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
    <div className="w-full h-full bg-white rounded-xl shadow-2xl flex overflow-hidden border border-gray-200">
      {!selectedConversation && (
        <div className="w-80 flex flex-col border-r border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex items-center gap-2">
              {view === "conversations" && (
                <button
                  onClick={() => setView("group-creator")}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Create group"
                  title="Create group chat"
                >
                  <Users size={20} />
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setView("conversations")}
              className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
                view === "conversations"
                  ? "text-purple-600 border-b-2 border-purple-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Conversations
            </button>
            <button
              onClick={() => setView("contacts")}
              className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
                view === "contacts"
                  ? "text-purple-600 border-b-2 border-purple-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              New Chat
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
                selectedConversationId={null}
                onConversationSelect={handleConversationSelect}
                loading={loading}
              />
            ) : (
              <div className="h-full overflow-y-auto">
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
                  <div className="divide-y divide-gray-100">
                    {contacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => handleContactSelect(contact)}
                        className="w-full p-4 flex items-start gap-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shadow-md">
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

                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {contact.username}
                          </h3>
                          {contact.role && (
                            <span className="inline-block px-2 py-0.5 text-xs rounded-full font-medium mb-1 capitalize bg-purple-100 text-purple-700">
                              {contact.role}
                            </span>
                          )}
                          {contact.email && (
                            <p className="text-sm text-gray-500 truncate">
                              {contact.email}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white border-b border-purple-700 shadow-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>

                <div>
                  <h2 className="text-lg font-semibold">
                    {getConversationDisplayInfo(selectedConversation).name}
                  </h2>
                  <p className="text-xs text-purple-100">
                    {getConversationDisplayInfo(selectedConversation).subtitle}
                  </p>
                </div>
              </div>
            </div>

            <ConversationChatRoom
              conversation={selectedConversation}
              onMarkAsRead={handleMarkAsRead}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center animate-pulse">
                <MessageSquarePlus className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-500">
                Choose a conversation from the list or start a new chat
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}