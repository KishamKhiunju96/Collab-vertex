"use client";

import { useEffect, useRef, useState } from "react";
import { Conversation, ConversationMessage } from "@/chat/types";
import { chatService } from "@/api/services/chatService";
import { useConversationWebSocket } from "@/chat/hooks/useConversationWebSocket";
import { Send, Loader2, WifiOff, RefreshCw, Users, User } from "lucide-react";
import { useUserData } from "@/api/hooks/useUserData";

interface ConversationChatRoomProps {
  conversation: Conversation;
  onMarkAsRead: () => void;
}

export default function ConversationChatRoom({
  conversation,
  onMarkAsRead,
}: ConversationChatRoomProps) {
  const { user } = useUserData();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    messages: wsMessages,
    sendMessage,
    sendTypingIndicator,
    markAsRead: markAsReadWS,
    isConnected,
    error: wsError,
    connect,
    disconnect,
  } = useConversationWebSocket({ 
    conversationId: conversation.id, 
    autoConnect: true,
    onMessageReceived: (data: any) => {
      // Handle different message types from backend
      if (data.type === 'typing') {
        handleTypingIndicator(data);
      } else if (data.type === 'read_receipt') {
        console.log("Read receipt received:", data);
      } else if (data.type === 'status_update') {
        console.log("Status update:", data);
      }
    }
  });

  const handleTypingIndicator = (data: any) => {
    const userId = data.user_id;
    const isTypingNow = data.is_typing;

    setTypingUsers((prev) => {
      const newSet = new Set(prev);
      if (isTypingNow) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });

    // Auto-clear after 3 seconds
    setTimeout(() => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }, 3000);
  };

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const data = await chatService.getConversationMessages(conversation.id);
        setMessages(data);
        console.log("Fetched messages for conversation:", conversation.id, data);
        
        // Mark as read when opening conversation
        onMarkAsRead();
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [conversation.id, onMarkAsRead]);

  // Auto-connect WebSocket when component mounts
  useEffect(() => {
    console.log("Auto-connecting to conversation:", conversation.id);
    connect();

    return () => {
      console.log("Disconnecting from conversation:", conversation.id);
      disconnect();
    };
  }, [conversation.id, connect, disconnect]);

  // Merge WebSocket messages with fetched messages
  useEffect(() => {
    if (wsMessages.length > 0) {
      setMessages((prev) => {
        // Avoid duplicates
        const newMessages = wsMessages.filter(
          (wsMsg) => !prev.some((msg) => msg.id === wsMsg.id)
        );
        return [...prev, ...newMessages];
      });

      // Auto-scroll to bottom
      scrollToBottom();
    }
  }, [wsMessages]);

  // Mark conversation as read when viewing messages
  useEffect(() => {
    if (isConnected && messages.length > 0) {
      markAsReadWS();
      if (onMarkAsRead) {
        onMarkAsRead();
      }
    }
  }, [messages.length, isConnected, markAsReadWS, onMarkAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMessage(value);

    // Send typing indicator
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      sendTypingIndicator(true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(false);
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected) return;

    try {
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        sendTypingIndicator(false);
      }

      // Send via WebSocket
      await sendMessage(inputMessage, "TEXT");
      setInputMessage("");

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
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

  const renderMessage = (message: ConversationMessage, index: number) => {
    const isSentByMe = message.sender_id === user?.id;
    const senderName = message.sender_name || "Unknown";
    const messageTimestamp = message.timestamp || message.created_at;

    const showDateSeparator =
      index === 0 ||
      formatDate(messageTimestamp) !== formatDate(messages[index - 1]?.timestamp || messages[index - 1]?.created_at);

    return (
      <div key={message.id}>
        {/* Date Separator */}
        {showDateSeparator && (
          <div className="flex items-center justify-center my-6">
            <div className="bg-gray-200 text-gray-700 text-xs px-4 py-1.5 rounded-full font-medium shadow-sm">
              {formatDate(messageTimestamp)}
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`flex mb-1.5 px-4 group ${
            isSentByMe ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] ${
              isSentByMe
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl rounded-br-md shadow-md"
                : "bg-white border border-gray-200 text-gray-900 rounded-3xl rounded-bl-md shadow-sm"
            } px-4 py-2.5 transition-shadow duration-200`}
          >
            {/* Show sender name in group chats */}
            {!isSentByMe && conversation.type === "GROUP" && (
              <p className="text-xs font-semibold text-purple-600 mb-1">
                {senderName}
              </p>
            )}
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>

        {/* Time stamp */}
        {(index === messages.length - 1 || showDateSeparator) && (
          <div
            className={`flex mb-4 px-4 ${
              isSentByMe ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-xs text-gray-500 mt-0.5">
              {formatTime(messageTimestamp)}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <WifiOff size={16} />
            <span>Disconnected</span>
          </div>
          <button
            onClick={connect}
            className="text-xs text-yellow-700 hover:text-yellow-900 font-medium flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Reconnect
          </button>
        </div>
      )}

      {wsError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-800">
          {wsError}
        </div>
      )}

      {/* Messages List */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto py-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center px-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                {conversation.type === "GROUP" ? (
                  <Users className="w-8 h-8 text-purple-500" />
                ) : (
                  <User className="w-8 h-8 text-purple-500" />
                )}
              </div>
              <p className="text-gray-500 text-sm">No messages yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-gray-50">
        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="px-4 pt-2 text-xs text-gray-500 italic">
            {Array.from(typingUsers).length === 1 
              ? "Someone is typing..." 
              : `${Array.from(typingUsers).length} people are typing...`}
          </div>
        )}
        
        <div className="p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            />
            <button
              type="submit"
              disabled={!isConnected || !inputMessage.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-medium text-sm"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
