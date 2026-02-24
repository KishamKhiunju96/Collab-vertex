"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/chat/hooks/useChat";
import { ChatMessage } from "@/chat/types";
import { Send, Loader2, WifiOff, RefreshCw } from "lucide-react";
import { useUserData } from "@/api/hooks/useUserData";

interface ChatRoomProps {
  otherUserId: string;
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

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
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
    const isSentByMe = message.sender_id === user?.id;
    const showDateSeparator =
      index === 0 ||
      formatDate(message.sent_at) !== formatDate(messages[index - 1]?.sent_at);

    return (
      <div key={message.id}>
        {/* Date Separator */}
        {showDateSeparator && (
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {formatDate(message.sent_at)}
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`flex mb-4 ${isSentByMe ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] ${
              isSentByMe
                ? "bg-blue-600 text-white rounded-l-2xl rounded-br-2xl"
                : "bg-gray-200 text-gray-900 rounded-r-2xl rounded-bl-2xl"
            } px-4 py-2 shadow-md`}
          >
            <p className="text-sm leading-relaxed break-words">
              {message.content}
            </p>
            <div
              className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                isSentByMe ? "text-blue-100" : "text-gray-500"
              }`}
            >
              <span>{formatTime(message.sent_at)}</span>
              {isSentByMe && (
                <span>
                  {message.is_read ? (
                    <span className="text-blue-200">✓✓</span>
                  ) : message.is_delivered ? (
                    <span className="text-blue-300">✓✓</span>
                  ) : (
                    <span className="text-blue-400">✓</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{otherUserName}</h2>
            <div className="flex items-center gap-2 text-sm">
              {isConnected ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff size={14} />
                  <span className="text-red-200">Disconnected</span>
                </>
              )}
            </div>
          </div>

          {!isConnected && (
            <button
              onClick={reconnect}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm"
            >
              <RefreshCw size={16} />
              Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Loading...
                </span>
              ) : (
                "Load older messages"
              )}
            </button>
          </div>
        )}

        {/* Messages */}
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation!</p>
            </div>
          </div>
        ) : (
          <div>{messages.map((msg, idx) => renderMessage(msg, idx))}</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              isConnected ? "Type a message..." : "Connecting to chat..."
            }
            disabled={!isConnected}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2 font-medium"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        {/* Typing Indicator (optional - requires backend support) */}
        {/* <div className="mt-2 text-xs text-gray-500 h-4">
          <span>typing...</span>
        </div> */}
      </div>
    </div>
  );
}
