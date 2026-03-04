"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/chat/hooks/useChat";
import { ChatMessage } from "@/chat/types";
import { Send, Loader2, WifiOff, RefreshCw, Plus, Image as ImageIcon, Mic, Smile, ThumbsUp } from "lucide-react";
import { useUserData } from "@/api/hooks/useUserData";

interface ChatRoomProps {
  otherUserId: string; // User's UUID (NOT profile id) - required for WebSocket connection
  otherUserName?: string;
}

export default function ChatRoom({
  otherUserId,
  otherUserName = "User",
}: ChatRoomProps) {
  const { user } = useUserData();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    loadMoreMessages,
    isConnected,
    isLoading,
    hasMore,
    error,
    reconnect,
  } = useChat({
    otherUserId,
    enabled: true,
  });

  // Ensure messages is always an array
  const safeMessages = Array.isArray(messages) ? messages : [];

  // Helper function for initials
  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "?";
    return name
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  };

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [safeMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected) return;

    sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const container = messagesContainerRef.current;
      const scrollHeightBefore = container?.scrollHeight || 0;

      loadMoreMessages().then(() => {
        // Maintain scroll position after loading older messages
        if (container) {
          const scrollHeightAfter = container.scrollHeight;
          container.scrollTop = scrollHeightAfter - scrollHeightBefore;
        }
      });
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "";
    }
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    // Check if message was sent by current user
    // Method 1: Direct ID match (most reliable)
    const directMatch = message.sender_id === user?.id;
    
    // Method 2: If sender is not the other user, it must be me (fallback)
    const isNotOtherUser = message.sender_id !== otherUserId;
    
    // Use direct match first, fallback to checking if not other user
    const isSentByMe = directMatch || (!directMatch && isNotOtherUser);
    
    const showDateSeparator =
      index === 0 ||
      formatDate(message.sent_at) !== formatDate(safeMessages[index - 1]?.sent_at);

    return (
      <div key={message.id}>
        {/* Date Separator */}
        {showDateSeparator && (
          <div className="flex items-center justify-center my-6">
            <div className="bg-gray-200 text-gray-700 text-xs px-4 py-1.5 rounded-full font-medium shadow-sm">
              {formatDate(message.sent_at)}
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`flex mb-1.5 px-6 group ${isSentByMe ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] ${
              isSentByMe
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl rounded-br-md shadow-md hover:shadow-lg"
                : "bg-white border border-gray-200 text-gray-900 rounded-3xl rounded-bl-md shadow-sm hover:shadow-md"
            } px-4 py-3 transition-shadow duration-200`}
          >
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>
        
        {/* Time stamp (shown on last message or after date separator) */}
        {(index === safeMessages.length - 1 || showDateSeparator) && (
          <div
            className={`flex mb-4 px-6 ${isSentByMe ? "justify-end" : "justify-start"}`}
          >
            <span className="text-xs text-gray-500 mt-0.5 font-medium">
              {formatTime(message.sent_at)}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200 flex items-center gap-2 animate-pulse">
          <WifiOff size={16} className="text-amber-700" />
          <p className="text-amber-800 text-sm font-medium">Connecting to chat server...</p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 px-4 py-2.5 border-b border-red-200 flex items-center justify-between">
          <p className="text-red-700 text-sm font-medium">{error}</p>
          <button
            onClick={reconnect}
            className="text-red-700 hover:text-red-800 text-xs font-semibold flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center py-4">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 
                rounded-full text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={14} />
                  <span>Loading messages...</span>
                </div>
              ) : (
                "Load earlier messages"
              )}
            </button>
          </div>
        )}

        {/* Messages */}
        {safeMessages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400 px-4">
            <div className="text-center max-w-sm">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {getInitials(otherUserName)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{otherUserName}</h3>
              <p className="text-sm text-gray-600 mb-3">
                You're now connected on Collab Chat
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Start the conversation with a friendly message. This is the beginning of your chat history.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-6">{safeMessages.map((msg, idx) => renderMessage(msg, idx))}</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3.5 shadow-sm">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* Action buttons */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
              title="Add attachment"
            >
              <Plus size={20} />
            </button>
            
          </div>

          {/* Input field */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 px-4 py-2.5 bg-gray-100 border-none rounded-full 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
              disabled:cursor-not-allowed text-sm placeholder:text-gray-500 transition-all duration-200 text-black"
          />

          {/* Send button or like */}
          {inputMessage.trim() ? (
            <button
              type="submit"
              disabled={!isConnected || !inputMessage.trim()}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 
                hover:to-purple-700 rounded-full transition-all duration-200 disabled:opacity-50 
                disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
              title="Send message"
            >
              <Send size={18} />
            </button>
          ) : (
            <button
              type="button"
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
              title="Send emoji"
            >
              <Smile size={20} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
