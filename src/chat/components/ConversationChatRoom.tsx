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
        console.log("Read receipt received:", data);
      } else if (data.type === "status_update") {
        console.log("Status update:", data);
      } else if (data.content) {
        // ⚠️ CRITICAL FIX: If backend doesn't set sender_id, inject current user's ID
        // This happens when the backend echoes our message back but doesn't populate sender_id
        if (!data.sender_id && user?.id) {
          console.log("⚠️ Backend didn't set sender_id, injecting current user ID");
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

  // Log current user ID for debugging
  useEffect(() => {
    console.log("🔍 USER DEBUG - Full user object:", user);
    console.log("🔍 USER DEBUG - Object keys:", user ? Object.keys(user) : "user is null");
    
    if (!user) {
      console.error("🚨 USER IS NULL!");
    } else if (!user.id) {
      console.error("🚨 USER EXISTS BUT user.id IS UNDEFINED!");
      console.error("User object:", JSON.stringify(user, null, 2));
    } else {
      console.log("✅ Current user in chat room:", {
        id: user.id,
        id_type: typeof user.id,
        username: user.username,
        role: user.role,
      });
      console.log("📋 Conversation participants:", {
        conversationId: conversation.id,
        type: conversation.type,
        participants: conversation.participants,
        participantCount: conversation.participants?.length || 0,
      });
    }
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
        
        console.log("📥 Fetched messages:", {
          conversationId: conversation.id,
          messageCount: sortedData.length,
          firstMessage: sortedData[0] ? {
            id: sortedData[0].id,
            sender_id: sortedData[0].sender_id,
            receiver_id: sortedData[0].receiver_id,
            content: sortedData[0].content?.substring(0, 30) + "...",
          } : null,
        });

        // Mark as read when opening conversation
        onMarkAsRead();
        
        // Scroll to bottom after messages load
        setTimeout(() => scrollToBottom(), 100);
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
    // Ensure we have valid user data
    if (!user) {
      console.error("🚨 Cannot render message - user not loaded");
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
        if (index === 0) {
          console.log("✅ Found user ID from conversation participants:", currentUserId);
        }
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
        if (index === 0) {
          console.log("✅ Matched message by username instead of ID");
        }
      }
    }
    
    // Convert both to strings for comparison and normalize
    const userIdStr = String(currentUserId || "").trim().toLowerCase();
    const senderIdStr = String(messageSenderId || "").trim().toLowerCase();
    
    // Determine if message was sent by current user
    const isSentByMe = Boolean(senderIdStr && userIdStr && senderIdStr === userIdStr);

    // 🔍 DEBUGGING: Log comparison details
    console.log("🔍 Message alignment check:", {
      messageId: message.id,
      currentUserId: currentUserId,
      currentUserId_type: typeof currentUserId,
      messageSenderId: messageSenderId,
      messageSenderId_type: typeof messageSenderId,
      userIdStr: userIdStr,
      senderIdStr: senderIdStr,
      isSentByMe: isSentByMe,
      comparison: `"${senderIdStr}" === "${userIdStr}" = ${senderIdStr === userIdStr}`,
      content: message.content?.substring(0, 20) + "...",
    });

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
        {/* Date Separator */}
        {showDateSeparator && (
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
              {formatDate(messageTimestamp)}
            </div>
          </div>
        )}

        {/* Message Container */}
        <div
          className={`flex mb-2 px-3 ${
            isSentByMe ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[75%] sm:max-w-[60%] ${
              isSentByMe ? "items-end" : "items-start"
            } flex flex-col`}
          >
            {/* Sender Name (only for received messages) */}
            {!isSentByMe && (
              <span className="text-xs text-gray-500 mb-1 px-3">
                {senderName}
              </span>
            )}

            {/* Message Bubble */}
            <div
              className={`relative px-4 py-2 rounded-2xl ${
                isSentByMe
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {/* Timestamp below message bubble */}
            <div
              className={`flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs ${
                isSentByMe 
                  ? "bg-purple-100 text-purple-700" 
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span>{formatTime(messageTimestamp)}</span>
              {isSentByMe && message.is_read && (
                <span>✓✓</span>
              )}
              {isSentByMe && !message.is_read && message.is_delivered && (
                <span>✓</span>
              )}
            </div>
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
        className="flex-1 overflow-y-auto px-2 py-4 bg-gradient-to-b from-gray-50 to-gray-100"
        style={{ 
          scrollBehavior: "smooth",
          overscrollBehavior: "contain"
        }}
      >
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
          <div className="space-y-1">
            {user && messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white shadow-lg">
        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="px-4 pt-3 pb-1 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="italic">
                {Array.from(typingUsers).length === 1
                  ? "Someone is typing"
                  : `${Array.from(typingUsers).length} people are typing`}
              </span>
            </div>
          </div>
        )}

        <div className="p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={!isConnected}
              className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!isConnected || !inputMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full hover:from-purple-700 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-xl flex items-center gap-2 font-medium text-sm transform hover:scale-105 active:scale-95"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
