"use client";

import { X, Minus } from "lucide-react";
import ChatRoom from "./ChatRoom";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ChatWindowProps {
  contact: ChatContact;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export default function ChatWindow({
  contact,
  isMinimized,
  onClose,
  onMinimize,
}: ChatWindowProps) {
  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "??";
    
    return name
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";
  };

  return (
    <div className="w-80 bg-white rounded-t-2xl shadow-xl flex flex-col border border-border-subtle overflow-hidden">
      {/* Header */}
      <div
        onClick={onMinimize}
        className="flex items-center justify-between p-3 bg-gradient-to-r from-button-primary-DEFAULT to-brand-primary-600 rounded-t-2xl cursor-pointer hover:from-button-primary-hover hover:to-brand-primary-700 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              {getInitials(contact.username)}
            </div>
            {contact.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-secondary-DEFAULT rounded-full border-2 border-button-primary-DEFAULT"></div>
            )}
          </div>
          {/* Name */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm truncate">
              {contact.username}
            </h4>
            {contact.role && (
              <p className="text-xs text-brand-primary-100 capitalize truncate">
                {contact.role}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="p-1.5 hover:bg-button-primary-hover rounded-full transition-colors text-white"
            aria-label="Minimize"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 hover:bg-blue-700 rounded-full transition-colors text-white"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <div className="h-[400px] flex flex-col">
          <ChatRoom otherUserId={contact.id} otherUserName={contact.username} />
        </div>
      )}
    </div>
  );
}
