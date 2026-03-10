"use client";

import { useEffect, useRef, useState } from "react";
import { Conversation, ConversationMessage } from "@/chat/types";
import { chatService } from "@/api/services/chatService";
import { useConversationWebSocket } from "@/chat/hooks/useConversationWebSocket";
import { useChatStore } from "@/chat/store/chatStore";
import {
  Loader2,
  WifiOff,
  RefreshCw,
  Users,
  User,
  Smile,
  Paperclip,
  Image as ImageIcon,
} from "lucide-react";
import { useUserData } from "@/api/hooks/useUserData";
import { format } from "date-fns";

interface ConversationChatRoomProps {
  conversation: Conversation;
  onMarkAsRead: () => void;
  onMessageSent?: (message: ConversationMessage) => void;
}

export default function ConversationChatRoom({
  conversation,
  onMarkAsRead,
  onMessageSent,
}: ConversationChatRoomProps) {
  const { user, loading: userLoading } = useUserData();

  const initConversation = useChatStore((state) => state.initConversation);
  const setMessages = useChatStore((state) => state.setMessages);
  const updateConversationTime = useChatStore(
    (state) => state.updateConversationTime
  );
  const setUserOnlineStatus = useChatStore(
    (state) => state.setUserOnlineStatus
  );

  useEffect(() => {
    initConversation(conversation.id);
  }, [conversation.id, initConversation]);

  const messages = useChatStore(
    (state) => state.messagesByConversation[conversation.id] ?? []
  );

  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
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
      if (data.type === "typing") {
        handleTypingIndicator(data);
      } else if (data.type === "status_update") {
        if (data.user_id && typeof data.is_online === "boolean") {
          setUserOnlineStatus(data.user_id, data.is_online);
        }
      } else if (data.content) {
        const message: ConversationMessage = {
          ...data,
          conversation_id: conversation.id,
        };

        if (!data.sender_id && user?.id) {
          message.sender_id = user.id;
        }

        const timestamp =
          message.sent_at || message.timestamp || message.created_at;
        updateConversationTime(conversation.id, timestamp);

        if (onMessageSent) {
          onMessageSent(message);
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

    setTimeout(() => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }, 3000);
  };

  useEffect(() => {
    if (conversation.participant_ids) {
      conversation.participant_ids.forEach((participantId) => {
        if (participantId !== user?.id) {
          // Will be updated by status messages
        }
      });
    }
  }, [user, conversation]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const data = await chatService.getConversationMessages(conversation.id);

        const sortedData = data.sort((a, b) => {
          const timeA = new Date(
            a.sent_at || a.timestamp || a.created_at
          ).getTime();
          const timeB = new Date(
            b.sent_at || b.timestamp || b.created_at
          ).getTime();
          return timeA - timeB;
        });

        setMessages(conversation.id, sortedData);

        try {
          await chatService.markConversationAsRead(conversation.id);
        } catch (error) {
          console.warn("Could not mark conversation as read:", error);
        }

        onMarkAsRead();
        setTimeout(() => scrollToBottom(), 100);
      } catch (err) {
        // Failed to fetch messages
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [conversation.id, onMarkAsRead, setMessages]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [conversation.id, connect, disconnect]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMessage(value);

    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      sendTypingIndicator(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(false);
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected) return;

    try {
      const messageContent = inputMessage.trim();

      if (isTyping) {
        setIsTyping(false);
        sendTypingIndicator(false);
      }

      await sendMessage(messageContent, "TEXT");
      setInputMessage("");

      const tempMessage: ConversationMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: conversation.id,
        sender_id: user?.id || "",
        receiver_id: "",
        content: messageContent,
        type: "TEXT",
        timestamp: new Date().toISOString(),
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const timestamp =
        tempMessage.sent_at || tempMessage.timestamp || tempMessage.created_at;
      updateConversationTime(conversation.id, timestamp);
      if (onMessageSent) {
        onMessageSent(tempMessage);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (err) {
      // Failed to send message
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const utcTimestamp = timestamp.endsWith("Z") ? timestamp : timestamp + "Z";
    const date = new Date(utcTimestamp);
    if (isNaN(date.getTime())) return "";
    return format(date, "h:mm a");
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    const utcTimestamp = timestamp.endsWith("Z") ? timestamp : timestamp + "Z";
    const date = new Date(utcTimestamp);
    if (isNaN(date.getTime())) return "";

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  const getMessageStatus = (
    message: ConversationMessage,
    isSentByMe: boolean
  ) => {
    if (!isSentByMe) return null;

    const readBy = message.read_by || [];
    const deliveredTo = message.delivered_to || [];

    if (readBy.some((id) => id !== message.sender_id)) {
      return "read";
    }
    if (deliveredTo.length > 0) {
      return "delivered";
    }
    return "sent";
  };

  const renderMessageStatus = (status: string | null) => {
    if (!status) return null;

    if (status === "read") {
      return (
        <svg
          className="w-4 h-4 text-blue-500"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 11-1.06-1.06L12.72 4.22a.75.75 0 011.06 0z" />
          <path d="M2.22 4.22a.75.75 0 011.06 0L7.5 8.44l5.22-5.22a.75.75 0 111.06 1.06L8.56 9.5l5.22 5.22a.75.75 0 11-1.06 1.06L7.5 10.56l-5.22 5.22a.75.75 0 11-1.06-1.06l5.22-5.22-5.22-5.22a.75.75 0 010-1.06z" />
        </svg>
      );
    }

    return (
      <svg
        className="w-4 h-4 text-gray-400"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 11-1.06-1.06L12.72 4.22a.75.75 0 011.06 0z" />
      </svg>
    );
  };

  const renderMessage = (message: ConversationMessage, index: number) => {
    if (!user) return null;

    let currentUserId =
      (user as any).id ||
      (user as any).user_id ||
      (user as any).userId ||
      (user as any)._id;

    if (!currentUserId && conversation.participants) {
      const currentUserParticipant = conversation.participants.find(
        (p) => p.username === user.username || p.email === user.email
      );
      if (currentUserParticipant) {
        currentUserId = currentUserParticipant.id;
      }
    }

    const userIdStr = String(currentUserId || "").trim().toLowerCase();
    const senderIdStr = String(message.sender_id || "").trim().toLowerCase();
    const isSentByMe = Boolean(
      senderIdStr && userIdStr && senderIdStr === userIdStr
    );

    let senderName = "Unknown User";
    if (isSentByMe) {
      senderName = user?.username || "You";
    } else {
      const senderParticipant = conversation.participants?.find(
        (p) => p.id === message.sender_id
      );
      if (senderParticipant?.username) {
        senderName = senderParticipant.username;
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

    const showTimestamp = index === messages.length - 1 || showDateSeparator;
    const messageStatus = getMessageStatus(message, isSentByMe);

    return (
      <div key={message.id} className="animate-in fade-in duration-300">
        {showDateSeparator && (
          <div className="flex justify-center my-6 first:mt-0">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {formatDate(messageTimestamp)}
            </span>
          </div>
        )}

        <div
          className={`flex mb-2 ${isSentByMe ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex flex-col ${
              isSentByMe ? "items-end" : "items-start"
            } max-w-xs`}
          >
            {!isSentByMe && conversation.type === "GROUP" && (
              <span className="text-xs font-medium text-gray-600 mb-1 px-3">
                {senderName}
              </span>
            )}

            <div
              className={`px-4 py-2.5 rounded-lg ${
                isSentByMe
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {showTimestamp && (
              <div className="flex items-center gap-1.5 mt-1 px-3">
                <span className="text-xs text-gray-500">
                  {formatTime(messageTimestamp)}
                </span>
                {isSentByMe && messageStatus && (
                  <div className="flex items-center">
                    {renderMessageStatus(messageStatus)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoadingMessages || userLoading || !user) {
    return (
      <div className="flex-1 flex h-full bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <div className="absolute inset-0 w-10 h-10 bg-blue-600/20 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-600">
              {!user ? "Loading user..." : "Loading messages..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Connection Status */}
      {!isConnected && (
        <div className="flex items-center justify-between gap-2 bg-yellow-50 border-b border-yellow-200 px-6 py-2.5">
          <div className="flex items-center gap-2">
            <WifiOff size={16} className="text-yellow-700 animate-pulse" />
            <span className="text-sm font-medium text-yellow-900">
              Connecting...
            </span>
          </div>
          <button
            onClick={connect}
            className="text-xs font-medium text-yellow-700 hover:text-yellow-900 transition-colors flex items-center gap-1"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}

      {wsError && (
        <div className="flex items-center gap-2 bg-red-50 border-b border-red-200 px-6 py-2.5 text-sm text-red-900">
          <span>⚠️</span>
          <span>{wsError}</span>
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 bg-white scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                {conversation.type === "GROUP" ? (
                  <Users className="w-8 h-8 text-gray-400" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-gray-900 font-medium mb-1">
                No messages yet
              </h3>
              <p className="text-gray-500 text-sm">
                Start the conversation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            {user &&
              messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        {typingUsers.size > 0 && (
          <div className="px-6 pt-3 pb-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
              <span>typing...</span>
            </div>
          </div>
        )}

        <div className="px-6 py-4">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <button
              type="button"
              className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors flex-shrink-0"
              title="Add emoji"
            >
              <Smile size={20} />
            </button>

            <button
              type="button"
              className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors flex-shrink-0"
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>

            <button
              type="button"
              className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors flex-shrink-0"
              title="Add image"
            >
              <ImageIcon size={20} />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Say something..."
              disabled={!isConnected}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-sm placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />

            {inputMessage.trim() ? (
              <button
                type="submit"
                disabled={!isConnected}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium text-sm rounded-lg transition-colors flex-shrink-0"
              >
                Send
              </button>
            ) : (
              <button
                type="button"
                className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors flex-shrink-0"
                title="Like"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}