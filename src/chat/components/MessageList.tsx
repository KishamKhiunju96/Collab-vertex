import React, { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { ConversationMessage } from "@/chat/types";
import { format } from "date-fns";

/**
 * DEPRECATED: Legacy MessageList component
 * 
 * This component is no longer actively used. Use ConversationChatRoom instead.
 * Updated to support new per-conversation message storage architecture.
 */
const MessageList: React.FC<{ conversationId?: string }> = ({ conversationId }) => {
  const initConversation = useChatStore((state) => state.initConversation);
  
  // Initialize conversation if provided
  useEffect(() => {
    if (conversationId) {
      initConversation(conversationId);
    }
  }, [conversationId, initConversation]);
  
  // Get messages for specific conversation
  const messages: ConversationMessage[] = useChatStore((state) => 
    conversationId ? (state.messagesByConversation[conversationId] ?? []) : []
  );

  return (
    <div className="flex flex-col space-y-2 overflow-y-auto h-full p-2 ">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          {conversationId ? "No messages in this conversation" : "Select a conversation to view messages"}
        </div>
      ) : (
        messages.map((msg) => {
          // Backend sends timestamps WITHOUT 'Z' suffix, but they ARE UTC
          const timestamp = msg.timestamp || msg.sent_at || msg.created_at;
          const utcTimestamp = timestamp.endsWith('Z') ? timestamp : timestamp + 'Z';
          const date = new Date(utcTimestamp);
          const displayTime = !isNaN(date.getTime()) ? format(date, "h:mm a") : "";
          
          return (
            <div key={msg.id} className="p-2 rounded bg-gray-200">
              <strong>{msg.sender_id}:</strong> {msg.content}
              <div className="text-xs text-gray-500">
                {displayTime}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;
