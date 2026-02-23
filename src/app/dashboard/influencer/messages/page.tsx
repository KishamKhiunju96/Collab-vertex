"use client";

import { useState, useMemo } from "react";
import { useAuthProtection } from "@/api/hooks/useAuth";
import { Search, MessageCircle, User, X } from "lucide-react";
import ChatRoom from "@/chat/components/ChatRoom";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline?: boolean;
  lastMessageTime?: string;
}

export default function InfluencerMessagesPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Mock chat contacts (replace with actual API call later)
  const [chatContacts] = useState<ChatContact[]>([
    {
      id: "brand-1",
      username: "Nike Brand",
      email: "nike@example.com",
      role: "brand",
      lastMessage: "We have an exciting campaign for you!",
      unreadCount: 3,
      isOnline: true,
      lastMessageTime: "5 min ago",
    },
    {
      id: "brand-2",
      username: "Adidas Marketing",
      email: "adidas@example.com",
      role: "brand",
      lastMessage: "Let's discuss collaboration details",
      unreadCount: 0,
      isOnline: false,
      lastMessageTime: "1 hour ago",
    },
    {
      id: "brand-3",
      username: "Puma Sports",
      email: "puma@example.com",
      role: "brand",
      lastMessage: "Your proposal looks great! When can we schedule a meeting?",
      unreadCount: 2,
      isOnline: true,
      lastMessageTime: "2 hours ago",
    },
    {
      id: "brand-4",
      username: "Under Armour",
      email: "underarmour@example.com",
      role: "brand",
      lastMessage: "Thanks for accepting our collaboration request!",
      unreadCount: 0,
      isOnline: false,
      lastMessageTime: "Yesterday",
    },
    {
      id: "brand-5",
      username: "Reebok",
      email: "reebok@example.com",
      role: "brand",
      lastMessage: "Can you send us your media kit?",
      unreadCount: 1,
      isOnline: true,
      lastMessageTime: "3 days ago",
    },
  ]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return chatContacts;
    }

    const query = searchQuery.toLowerCase();
    return chatContacts.filter(
      (contact) =>
        contact.username.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.lastMessage?.toLowerCase().includes(query),
    );
  }, [searchQuery, chatContacts]);

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

  const totalUnread = chatContacts.reduce(
    (sum, contact) => sum + (contact.unreadCount || 0),
    0,
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Role protection
  if (!authenticated || role !== "influencer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MessageCircle className="text-purple-600" size={32} />
                Messages
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Chat with brands and manage your conversations
                {totalUnread > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full font-medium">
                    {totalUnread} unread
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
          <div className="grid grid-cols-12 h-full">
            {/* Contacts Sidebar */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r border-gray-200 flex flex-col">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {/* Contacts List */}
              <div className="flex-1 overflow-y-auto">
                {filteredContacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <User size={48} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      {searchQuery ? "No contacts found" : "No messages yet"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchQuery
                        ? "Try a different search term"
                        : "Start a conversation with a brand"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                          selectedContact?.id === contact.id
                            ? "bg-purple-50 border-l-4 border-purple-600"
                            : ""
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                            {getInitials(contact.username)}
                          </div>
                          {contact.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {contact.username}
                            </h3>
                            {contact.unreadCount && contact.unreadCount > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full font-medium min-w-[20px] text-center">
                                {contact.unreadCount > 99
                                  ? "99+"
                                  : contact.unreadCount}
                              </span>
                            )}
                          </div>

                          {contact.lastMessage && (
                            <p
                              className={`text-sm truncate mb-1 ${
                                contact.unreadCount && contact.unreadCount > 0
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {contact.lastMessage}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            {contact.role && (
                              <span
                                className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium capitalize ${getRoleColor(contact.role)}`}
                              >
                                {contact.role}
                              </span>
                            )}
                            {contact.lastMessageTime && (
                              <span className="text-xs text-gray-400">
                                {contact.lastMessageTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col">
              {selectedContact ? (
                <div className="h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {getInitials(selectedContact.username)}
                        </div>
                        {selectedContact.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {selectedContact.username}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {selectedContact.isOnline ? "Active now" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Chat Room */}
                  <div className="flex-1 overflow-hidden">
                    <ChatRoom
                      otherUserId={selectedContact.id}
                      otherUserName={selectedContact.username}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageCircle
                      size={64}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a contact from the list to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
