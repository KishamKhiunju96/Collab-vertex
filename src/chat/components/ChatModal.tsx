"use client";

import { X, MessageCircle } from "lucide-react";
import ChatRoom from "./ChatRoom";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherUserId: string;
  otherUserName?: string;
  otherUserRole?: string;
}

export default function ChatModal({
  isOpen,
  onClose,
  otherUserId,
  otherUserName = "User",
  otherUserRole = "",
}: ChatModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}
      >
        <div
          className={`w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto transform transition-all duration-300 ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{otherUserName}</h2>
                {otherUserRole && (
                  <p className="text-sm text-blue-100 capitalize">
                    {otherUserRole}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Close chat"
            >
              <X size={24} />
            </button>
          </div>

          {/* Chat Room */}
          <div className="h-[calc(100%-80px)]">
            <ChatRoom otherUserId={otherUserId} otherUserName={otherUserName} />
          </div>
        </div>
      </div>
    </>
  );
}
