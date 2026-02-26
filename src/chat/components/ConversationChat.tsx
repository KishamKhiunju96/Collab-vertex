"use client";

import { useState } from "react";
import { Conversation } from "@/chat/types";
import { useConversations } from "@/chat/hooks/useConversationsList";
import { ConversationsList } from "./ConversationsList";
import ConversationChatRoom from "./ConversationChatRoom";
import { X, MessageSquarePlus, Users, ArrowLeft } from "lucide-react";

interface ConversationChatProps {
  onClose?: () => void;
}

export default function ConversationChat({ onClose }: ConversationChatProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const {
    conversations,
    loading,
    error,
    refresh,
  } = useConversations();

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleMarkAsRead = () => {
    // WebSocket handles sending read receipt via markAsReadWS() in ConversationChatRoom
    // No need to call REST API - backend handles it via WebSocket { type: "read" }
    console.log("Conversation marked as read via WebSocket");
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
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
      // Direct conversation - show other participant
      const participants = conversation.participants || [];
      const otherParticipant = participants.length > 0 ? participants[0] : null;
      return {
        name: otherParticipant?.username || conversation.name || "Unknown User",
        subtitle: otherParticipant?.email || "",
        isGroup: false,
      };
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center gap-3">
          {selectedConversation && (
            <button
              onClick={handleBackToList}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="text-lg font-semibold">
              {selectedConversation
                ? getConversationDisplayInfo(selectedConversation).name
                : "Messages"}
            </h2>
            {selectedConversation && (
              <p className="text-xs text-purple-100">
                {getConversationDisplayInfo(selectedConversation).subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!selectedConversation && (
            <>
              <button
                onClick={refresh}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Refresh conversations"
              >
                <MessageSquarePlus size={20} />
              </button>
            </>
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

      {/* Error State - Non-critical */}
      {error && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-sm text-yellow-800 flex items-center gap-2">
          <span>⚠️</span>
          <span>Unable to load conversation history. You can still start new chats.</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {selectedConversation ? (
          <ConversationChatRoom
            conversation={selectedConversation}
            onMarkAsRead={handleMarkAsRead}
          />
        ) : (
          <ConversationsList
            conversations={conversations}
            selectedConversationId={null}
            onConversationSelect={handleConversationSelect}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
