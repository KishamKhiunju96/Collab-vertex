"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatContactsList from "./ChatContactsList";
import ChatModal from "./ChatModal";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface FloatingChatButtonProps {
  contacts: ChatContact[];
  isLoading?: boolean;
  userRole?: "brand" | "influencer" | "admin";
  unreadTotal?: number;
}

export default function FloatingChatButton({
  contacts,
  isLoading = false,
  userRole,
  unreadTotal = 0,
}: FloatingChatButtonProps) {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(
    null
  );

  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
    setIsContactsOpen(false);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedContact(null);
  };

  const handleToggleContacts = () => {
    setIsContactsOpen(!isContactsOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={handleToggleContacts}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-30 group"
        aria-label="Open chat"
      >
        {isContactsOpen ? (
          <X size={28} className="transition-transform group-hover:rotate-90" />
        ) : (
          <MessageCircle
            size={28}
            className="transition-transform group-hover:rotate-12"
          />
        )}

        {/* Unread Badge */}
        {unreadTotal > 0 && !isContactsOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white animate-pulse">
            {unreadTotal > 99 ? "99+" : unreadTotal}
          </span>
        )}

        {/* Ripple Effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-75 animate-ping"></span>
      </button>

      {/* Contacts List Modal */}
      {isContactsOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={handleToggleContacts}
          />

          {/* Contacts Panel */}
          <div
            className={`fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 transform transition-all duration-300 ${
              isContactsOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <ChatContactsList
              contacts={contacts}
              onSelectContact={handleSelectContact}
              selectedContactId={selectedContact?.id}
              isLoading={isLoading}
            />
          </div>
        </>
      )}

      {/* Chat Modal */}
      {selectedContact && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          otherUserId={selectedContact.id}
          otherUserName={selectedContact.username}
          otherUserRole={selectedContact.role}
        />
      )}

      {/* Helper Text (optional - shows on first visit) */}
      {!isContactsOpen && contacts.length > 0 && (
        <div className="fixed bottom-24 right-6 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="relative">
            <p className="font-medium">
              {userRole === "brand"
                ? "Chat with Influencers"
                : "Chat with Brands"}
            </p>
            {unreadTotal > 0 && (
              <p className="text-xs text-gray-300 mt-1">
                {unreadTotal} unread {unreadTotal === 1 ? "message" : "messages"}
              </p>
            )}
            {/* Arrow pointing down to button */}
            <div className="absolute -bottom-2 right-4 w-3 h-3 bg-gray-900 transform rotate-45"></div>
          </div>
        </div>
      )}
    </>
  );
}
