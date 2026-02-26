"use client";

import { useState } from "react";
import { MessageCircle, X, Minus } from "lucide-react";
import ConversationChatContainer from "./ConversationChatContainer";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface FloatingConversationChatButtonProps {
  contacts: ChatContact[];
  isLoading?: boolean;
  unreadTotal?: number;
}

export default function FloatingConversationChatButton({
  contacts,
  isLoading = false,
  unreadTotal = 0,
}: FloatingConversationChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const handleToggleChat = () => {
    if (isChatMinimized) {
      setIsChatMinimized(false);
    } else {
      setIsChatOpen(!isChatOpen);
    }
  };

  const handleMinimizeChat = () => {
    setIsChatMinimized(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setIsChatMinimized(false);
  };

  return (
    <>
      {/* Chat Window */}
      {isChatOpen && !isChatMinimized && (
        <div className="fixed bottom-0 right-4 lg:right-8 w-full max-w-4xl h-[600px] bg-white rounded-t-2xl shadow-2xl z-[9998] border border-gray-200">
          {/* Minimize/Close Bar */}
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <button
              onClick={handleMinimizeChat}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors bg-white/60 backdrop-blur-sm"
              aria-label="Minimize"
            >
              <Minus size={18} className="text-purple-600" />
            </button>
            <button
              onClick={handleCloseChat}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors bg-white/60 backdrop-blur-sm"
              aria-label="Close"
            >
              <X size={18} className="text-purple-600" />
            </button>
          </div>

          {/* Chat Container */}
          <ConversationChatContainer
            contacts={contacts}
            onClose={handleCloseChat}
            isLoadingContacts={isLoading}
          />
        </div>
      )}

      {/* Minimized Chat Bar */}
      {isChatOpen && isChatMinimized && (
        <div
          onClick={handleToggleChat}
          className="fixed bottom-0 right-4 lg:right-8 w-80 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl shadow-xl cursor-pointer z-[9998] border border-purple-700"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="text-white" />
              <span className="font-semibold text-white">Messages</span>
              {unreadTotal > 0 && (
                <span className="px-2 py-0.5 bg-white text-purple-600 text-xs rounded-full font-bold">
                  {unreadTotal > 99 ? "99+" : unreadTotal}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseChat();
              }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={handleToggleChat}
          className="fixed bottom-6 right-4 lg:right-8 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 z-[9999] ring-4 ring-white"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
          {unreadTotal > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
              {unreadTotal > 9 ? "9+" : unreadTotal}
            </div>
          )}
        </button>
      )}
    </>
  );
}
