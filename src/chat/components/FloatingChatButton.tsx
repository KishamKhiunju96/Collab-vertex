"use client";

import { useState } from "react";
import { MessageCircle, X, Minus, Search, User } from "lucide-react";
import ChatWindow from "./ChatWindow";

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

interface OpenChat {
  contact: ChatContact;
  isMinimized: boolean;
}

export default function FloatingChatButton({
  contacts,
  isLoading = false,
  unreadTotal = 0,
}: FloatingChatButtonProps) {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isContactsMinimized, setIsContactsMinimized] = useState(false);
  const [openChats, setOpenChats] = useState<OpenChat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleContacts = () => {
    if (isContactsMinimized) {
      setIsContactsMinimized(false);
    } else {
      setIsContactsOpen(!isContactsOpen);
    }
  };

  const handleMinimizeContacts = () => {
    setIsContactsMinimized(true);
  };

  const handleCloseContacts = () => {
    setIsContactsOpen(false);
    setIsContactsMinimized(false);
  };

  const handleSelectContact = (contact: ChatContact) => {
    // Check if chat is already open
    const existingChat = openChats.find(
      (chat) => chat.contact.id === contact.id,
    );

    if (existingChat) {
      // If minimized, maximize it
      if (existingChat.isMinimized) {
        setOpenChats(
          openChats.map((chat) =>
            chat.contact.id === contact.id
              ? { ...chat, isMinimized: false }
              : chat,
          ),
        );
      }
    } else {
      // Open new chat (max 3 chats)
      if (openChats.length < 3) {
        setOpenChats([...openChats, { contact, isMinimized: false }]);
      } else {
        // Replace the first chat
        setOpenChats([{ contact, isMinimized: false }, ...openChats.slice(1)]);
      }
    }
  };

  const handleCloseChat = (contactId: string) => {
    setOpenChats(openChats.filter((chat) => chat.contact.id !== contactId));
  };

  const handleMinimizeChat = (contactId: string) => {
    setOpenChats(
      openChats.map((chat) =>
        chat.contact.id === contactId
          ? { ...chat, isMinimized: !chat.isMinimized }
          : chat,
      ),
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "brand":
        return "bg-blue-100 text-blue-700";
      case "influencer":
        return "bg-purple-100 text-purple-700";
      case "admin":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* Open Chat Windows */}
      <div className="fixed bottom-0 right-24 flex items-end gap-2 z-40">
        {openChats.map((chat) => (
          <ChatWindow
            key={chat.contact.id}
            contact={chat.contact}
            isMinimized={chat.isMinimized}
            onClose={() => handleCloseChat(chat.contact.id)}
            onMinimize={() => handleMinimizeChat(chat.contact.id)}
          />
        ))}
      </div>

      {/* Contacts Card - Facebook Style */}
      {isContactsOpen && !isContactsMinimized && (
        <div className="fixed bottom-0 right-6 w-80 bg-white rounded-t-lg shadow-2xl z-50 flex flex-col max-h-[500px] border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <MessageCircle size={18} />
              Chats
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handleMinimizeContacts}
                className="p-1.5 hover:bg-blue-700 rounded-full transition-colors text-white"
                aria-label="Minimize"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={handleCloseContacts}
                className="p-1.5 hover:bg-blue-700 rounded-full transition-colors text-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <User size={40} className="text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">
                  {searchQuery ? "No contacts found" : "No contacts yet"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(contact.username)}
                      </div>
                      {contact.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {contact.username}
                        </h4>
                        {contact.unreadCount && contact.unreadCount > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium min-w-[18px] text-center">
                            {contact.unreadCount > 9
                              ? "9+"
                              : contact.unreadCount}
                          </span>
                        )}
                      </div>
                      {contact.lastMessage && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {contact.lastMessage}
                        </p>
                      )}
                      {contact.role && (
                        <span
                          className={`inline-block px-1.5 py-0.5 text-xs rounded-full font-medium mt-1 capitalize ${getRoleColor(contact.role)}`}
                        >
                          {contact.role}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Minimized Contacts Bar */}
      {isContactsMinimized && (
        <div
          onClick={handleToggleContacts}
          className="fixed bottom-0 right-6 w-60 bg-white rounded-t-lg shadow-lg z-50 cursor-pointer hover:bg-gray-50 transition-colors border-t border-x border-gray-200"
        >
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg">
            <span className="font-semibold text-white text-sm flex items-center gap-2">
              <MessageCircle size={16} />
              Chats
              {unreadTotal > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                  {unreadTotal > 9 ? "9+" : unreadTotal}
                </span>
              )}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseContacts();
              }}
              className="p-1 hover:bg-blue-700 rounded-full transition-colors text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={handleToggleContacts}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-30"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />

        {/* Unread Badge */}
        {unreadTotal > 0 && !isContactsOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white">
            {unreadTotal > 9 ? "9+" : unreadTotal}
          </span>
        )}
      </button>
    </>
  );
}
