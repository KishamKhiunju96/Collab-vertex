"use client";

import { useState, useMemo } from "react";
import { useAuthProtection } from "@/api/hooks/useAuth";
import { 
  Search, 
  MessageCircle, 
  User, 
  X, 
  Info
} from "lucide-react";
import ChatRoom from "@/chat/components/ChatRoom";
import { useConversations } from "@/chat/hooks/useConversations";

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

type TabType = "all" | "unread" | "groups" | "communities";

export default function BrandMessagesPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [hoveredContact, setHoveredContact] = useState<string | null>(null);

  const { conversations, isLoading: conversationsLoading } = useConversations();

  const chatContacts: ChatContact[] = useMemo(() => {
    console.log("Brand Messages - Raw conversations:", conversations);
    const contacts = conversations.map((conv) => ({
      id: conv.user.id,
      username: conv.user.username,
      email: conv.user.email,
      role: conv.user.role,
      lastMessage: conv.lastMessage?.content,
      unreadCount: conv.unreadCount,
      isOnline: false,
      lastMessageTime: conv.lastMessage
        ? formatLastMessageTime(conv.lastMessage.sent_at)
        : undefined,
    }));
    console.log("Brand Messages - Converted contacts:", contacts);
    return contacts;
  }, [conversations]);

  const filteredContacts = useMemo(() => {
    let contacts = chatContacts;
    
    // Filter by tab
    if (activeTab === "unread") {
      contacts = contacts.filter(c => c.unreadCount && c.unreadCount > 0);
    }
    // groups and communities can be implemented later
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      contacts = contacts.filter(
        (contact) =>
          contact.username.toLowerCase().includes(query) ||
          contact.email?.toLowerCase().includes(query) ||
          contact.lastMessage?.toLowerCase().includes(query),
      );
    }
    
    return contacts;
  }, [searchQuery, chatContacts, activeTab]);

  const formatLastMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "??";

    return (
      name
        .split(" ")
        .filter((n) => n.length > 0)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??"
    );
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

  if (loading || conversationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authenticated || role !== "brand") {
    return null;
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex flex-1 h-full overflow-hidden">

        {/* ── LEFT PANEL – contact list (360px width) ─────────────────────── */}
        <div
          className={`
            ${selectedContact ? "hidden md:flex" : "flex"}
            flex-col
            w-full md:w-[380px]
            border-r border-gray-200 bg-white
            h-full
            shadow-sm
            transition-all duration-300 ease-in-out
          `}
        >
          {/* Fixed: panel header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between mb-0">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Messages
                </h1>
                {totalUnread > 0 && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {totalUnread} unread {totalUnread === 1 ? "message" : "messages"}
                  </p>
                )}
              </div>
              
            </div>
          </div>

          {/* Fixed: search bar */}
          <div className="flex-shrink-0 px-4 py-4 bg-white">
            <div className="relative group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white
                  transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Fixed: tabs */}
          <div className="flex-shrink-0 px-4 pb-3 bg-white">
            <div className="flex gap-2">
              {[
                { key: "all", label: "All Chats" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable: contact list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {conversationsLoading && chatContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                  <MessageCircle size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" />
                </div>
                <p className="text-sm text-gray-500 mt-4">Loading conversations...</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <User size={36} className="text-blue-600" />
                </div>
                <p className="text-gray-900 font-semibold text-lg mb-1">
                  {searchQuery ? "No results found" : "No conversations yet"}
                </p>
                <p className="text-sm text-gray-500 max-w-xs">
                  {searchQuery ? "Try searching with a different keyword" : "Start messaging influencers to see your conversations here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      console.log("Contact selected:", contact);
                      setSelectedContact(contact);
                    }}
                    onMouseEnter={() => setHoveredContact(contact.id)}
                    onMouseLeave={() => setHoveredContact(null)}
                    className={`w-full px-4 py-4 flex items-center gap-3.5 transition-all duration-200 ${
                      selectedContact?.id === contact.id 
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600" 
                        : hoveredContact === contact.id
                          ? "bg-gray-50"
                          : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                        flex items-center justify-center text-white font-semibold text-lg shadow-md
                        transition-transform duration-200 ${hoveredContact === contact.id ? "scale-105" : ""}`}>
                        {getInitials(contact.username)}
                      </div>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <div className="absolute -bottom-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-pink-600 
                          rounded-full border-2 border-white flex items-center justify-center shadow-sm animate-pulse">
                          <span className="text-white text-xs font-bold">
                            {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
                          </span>
                        </div>
                      )}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                        contact.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}></div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-baseline justify-between mb-1">
                        <h3
                          className={`font-medium text-base truncate ${
                            contact.unreadCount && contact.unreadCount > 0
                              ? "text-gray-900 font-bold"
                              : "text-gray-900"
                          }`}
                        >
                          {contact.username}
                        </h3>
                        {contact.lastMessageTime && (
                          <span className={`text-xs ml-2 flex-shrink-0 font-medium ${
                            contact.unreadCount && contact.unreadCount > 0
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}>
                            {contact.lastMessageTime}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {contact.lastMessage && (
                          <p
                            className={`text-sm truncate ${
                              contact.unreadCount && contact.unreadCount > 0
                                ? "text-gray-900 font-semibold"
                                : "text-gray-500"
                            }`}
                          >
                            {contact.lastMessage}
                          </p>
                        )}
                        {contact.role && (
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium capitalize flex-shrink-0 ${getRoleColor(contact.role)}`}>
                            {contact.role}
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

        {/* ── RIGHT PANEL – chat window ─────────────────────── */}
        <div
          className={`
            ${selectedContact ? "flex" : "hidden md:flex"}
            flex-col bg-white
            w-full md:flex-1
            h-full
            transition-all duration-300
          `}
        >
          {selectedContact ? (
            <>
              {/* Fixed: chat header */}
              <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-all duration-200 -ml-2"
                  >
                    <X size={22} className="text-gray-600" />
                  </button>
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                      flex items-center justify-center text-white font-semibold shadow-md">
                      {getInitials(selectedContact.username)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      selectedContact.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}></div>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-base">
                      {selectedContact.username}
                    </h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {selectedContact.isOnline ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Active now
                        </>
                      ) : (
                        "Offline"
                      )}
                    </p>
                  </div>
                </div>
          
              </div>

              {/* Scrollable: messages */}
              <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                <ChatRoom
                  otherUserId={selectedContact.id}
                  otherUserName={selectedContact.username}
                />
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
              <div className="text-center px-6 animate-fade-in">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
                  flex items-center justify-center shadow-xl">
                  <MessageCircle
                    size={48}
                    className="text-white"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Messages
                </h3>
                <p className="text-gray-600 text-base max-w-md mx-auto leading-relaxed">
                  Select a conversation from the sidebar to start messaging influencers and manage all your communications
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}