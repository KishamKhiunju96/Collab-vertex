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
  const { user, loading: userLoading } = useUserData();
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
      if (data.type === "typing") {
        handleTypingIndicator(data);
      } else if (data.type === "read_receipt") {
        // Read receipt received
      } else if (data.type === "status_update") {
        // Status update
      } else if (data.content) {
        // ⚠️ CRITICAL FIX: If backend doesn't set sender_id, inject current user's ID
        // This happens when the backend echoes our message back but doesn't populate sender_id
        if (!data.sender_id && user?.id) {
          data.sender_id = user.id;
        }
      }
    },
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

  // User validation
  useEffect(() => {
    // Validate user and participants
  }, [user, conversation]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const data = await chatService.getConversationMessages(conversation.id);
        
        // Sort messages by timestamp
        const sortedData = data.sort((a, b) => {
          const timeA = new Date(a.sent_at || a.timestamp || a.created_at).getTime();
          const timeB = new Date(b.sent_at || b.timestamp || b.created_at).getTime();
          return timeA - timeB;
        });
        
        setMessages(sortedData);

        // Mark as read when opening conversation
        onMarkAsRead();
        
        // Scroll to bottom after messages load
        setTimeout(() => scrollToBottom(), 100);
      } catch (err) {
        // Failed to fetch messages
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [conversation.id, onMarkAsRead]);

  // Auto-connect WebSocket when component mounts
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [conversation.id, connect, disconnect]);

  // Merge WebSocket messages with fetched messages
  useEffect(() => {
    if (wsMessages.length > 0) {
      setMessages((prev) => {
        // Avoid duplicates
        const newMessages = wsMessages.filter(
          (wsMsg) => !prev.some((msg) => msg.id === wsMsg.id),
        );
        
        // Combine and sort by timestamp
        const combined = [...prev, ...newMessages];
        return combined.sort((a, b) => {
          const timeA = new Date(a.sent_at || a.timestamp || a.created_at).getTime();
          const timeB = new Date(b.sent_at || b.timestamp || b.created_at).getTime();
          return timeA - timeB;
        });
      });

      // Auto-scroll to bottom with smooth animation
      setTimeout(() => scrollToBottom(), 100);
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
      // Failed to send message
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
    // Ensure we have valid user data
    if (!user) {
      return null;
    }

    // 🔧 CRITICAL FIX: Backend doesn't return user.id, so find it from conversation participants
    let currentUserId = (user as any).id || (user as any).user_id || (user as any).userId || (user as any)._id;
    
    if (!currentUserId && conversation.participants) {
      // Find current user in participants by matching username or email
      const currentUserParticipant = conversation.participants.find(
        (p) => p.username === user.username || p.email === user.email
      );
      
      if (currentUserParticipant) {
        currentUserId = currentUserParticipant.id;
      }
    }
    
    const messageSenderId = message.sender_id;
    
    if (!currentUserId) {
      // Fallback: Try to match by username
      const senderParticipant = conversation.participants?.find(
        (p) => p.id === messageSenderId
      );
      if (senderParticipant && senderParticipant.username === user.username) {
        currentUserId = messageSenderId;
      }
    }
    
    // Convert both to strings for comparison and normalize
    const userIdStr = String(currentUserId || "").trim().toLowerCase();
    const senderIdStr = String(messageSenderId || "").trim().toLowerCase();
    
    // Determine if message was sent by current user
    const isSentByMe = Boolean(senderIdStr && userIdStr && senderIdStr === userIdStr);

    // Get sender name from multiple sources
    let senderName = "Unknown User";
    
    if (isSentByMe) {
      // If it's my message, use my username
      senderName = user?.username || "You";
    } else {
      // For received messages, try to get sender name from:
      // 1. Conversation participants (by matching sender_id with id)
      const senderParticipant = conversation.participants?.find(
        (p) => p.id === message.sender_id
      );
      
      if (senderParticipant?.username) {
        senderName = senderParticipant.username;
      } else if (message.sender_name) {
        // 2. Message's sender_name field (if provided by backend)
        senderName = message.sender_name;
      } else if (conversation.type === "DIRECT" && conversation.name) {
        // 3. For direct chats, use conversation name (usually the other person's name)
        senderName = conversation.name;
      }
    }
    
    const messageTimestamp =
      message.timestamp || message.sent_at || message.created_at;

    const showDateSeparator =
      index === 0 ||
      formatDate(messageTimestamp) !==
        formatDate(
          messages[index - 1]?.timestamp ||
            messages[index - 1]?.sent_at ||
            messages[index - 1]?.created_at
        );

    // Show timestamp for last message or after date separator
    const showTimestamp = index === messages.length - 1 || showDateSeparator;

    return (
      <div key={message.id} className="animate-fadeIn">
        {/* Message Container */}
        <div
          className={`flex mb-1.5 ${
            isSentByMe ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] ${
              isSentByMe ? "items-end" : "items-start"
            } flex flex-col`}
          >
            {/* Message Bubble */}
            <div
              className={`relative px-4 py-2.5 ${
                isSentByMe
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-3xl rounded-br-lg"
                  : "bg-gray-100 text-gray-900 rounded-3xl rounded-bl-lg"
              }`}
            >
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {/* Timestamp - only show on last message or when hovering */}
            {showTimestamp && (
              <div className="text-[11px] text-gray-500 mt-1 px-2">
                {formatTime(messageTimestamp)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 🚨 CRITICAL: Wait for user to load before rendering anything
  if (isLoadingMessages || userLoading || !user) {
    return (
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              <div className="absolute inset-0 w-12 h-12 bg-purple-500/20 rounded-full animate-ping"></div>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {!user ? "Loading user..." : userLoading ? "Loading user..." : "Loading messages..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between animate-slideDown">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <WifiOff size={16} className="animate-pulse" />
            <span className="font-medium">Connecting...</span>
          </div>
          <button
            onClick={connect}
            className="text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 hover:underline"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {wsError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-800 flex items-center gap-2">
          <span className="font-medium">⚠️</span>
          <span>{wsError}</span>
        </div>
      )}

      {/* Messages List */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 bg-white"
        style={{ 
          scrollBehavior: "smooth",
          overscrollBehavior: "contain"
        }}
      >
        {/* Date Separator */}
        {messages.length > 0 && (
          <div className="flex items-center justify-center my-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
              Today
            </span>
          </div>
        )}
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center px-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-lg">
                {conversation.type === "GROUP" ? (
                  <Users className="w-10 h-10 text-purple-500" />
                ) : (
                  <User className="w-10 h-10 text-purple-500" />
                )}
              </div>
              <p className="text-gray-600 text-base font-medium mb-1">
                No messages yet
              </p>
              <p className="text-gray-400 text-sm">
                Start the conversation by sending a message
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {user && messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="px-6 pt-3 pb-1 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="italic">
                {Array.from(typingUsers).length === 1
                  ? "typing..."
                  : `${Array.from(typingUsers).length} people are typing...`}
              </span>
            </div>
          </div>
        )}

        <div className="px-4 py-3">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            {/* Emoji Button */}
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              title="Add emoji"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Attachment Button */}
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              title="Attach file"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            {/* Image Button */}
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              title="Add image"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Input */}
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Message..."
              disabled={!isConnected}
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm placeholder:text-gray-500"
            />

            {/* Send/Like Button */}
            {inputMessage.trim() ? (
              <button
                type="submit"
                disabled={!isConnected}
                className="p-2 text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors disabled:text-gray-400 disabled:cursor-not-allowed flex-shrink-0"
                title="Send message"
              >
                Send
              </button>
            ) : (
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                title="Like"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
