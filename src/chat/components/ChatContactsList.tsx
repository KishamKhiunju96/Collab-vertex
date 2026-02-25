"use client";

import { useState, useMemo } from "react";
import { Search, MessageCircle, User, Loader2 } from "lucide-react";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ChatContactsListProps {
  contacts: ChatContact[];
  onSelectContact: (contact: ChatContact) => void;
  selectedContactId?: string;
  isLoading?: boolean;
}

export default function ChatContactsList({
  contacts,
  onSelectContact,
  selectedContactId,
  isLoading = false,
}: ChatContactsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return contacts;
    }

    const query = searchQuery.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.username.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.role?.toLowerCase().includes(query),
    );
  }, [searchQuery, contacts]);

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
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <MessageCircle size={24} className="text-blue-600" />
          Messages
        </h2>

        {/* Search Box */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <User size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">
              {searchQuery ? "No contacts found" : "No contacts yet"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Start a conversation to see contacts here"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                  selectedContactId === contact.id
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {getInitials(contact.username)}
                  </div>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {contact.username}
                    </h3>
                    {contact.unreadCount && contact.unreadCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                        {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
                      </span>
                    )}
                  </div>

                  {contact.role && (
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium mb-1 capitalize ${getRoleColor(contact.role)}`}
                    >
                      {contact.role}
                    </span>
                  )}

                  {contact.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {contact.lastMessage}
                    </p>
                  )}

                  {contact.email && !contact.lastMessage && (
                    <p className="text-sm text-gray-400 truncate">
                      {contact.email}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
