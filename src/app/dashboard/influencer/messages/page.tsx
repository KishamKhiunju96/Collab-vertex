"use client";

import { useState, useMemo } from "react";
import { useAuthProtection } from "@/api/hooks/useAuth";
import { 
  Search, 
  MessageCircle, 
  User, 
  X, 
  MoreHorizontal,
  Edit,
  Phone,
  Video,
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

export default function InfluencerMessagesPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Fetch conversations from API
  const { conversations, isLoading: conversationsLoading } = useConversations();

  // Convert ChatConversation to ChatContact format
  // NOTE: conv.user.id is already the user_id (not profile id) from the backend
  const chatContacts: ChatContact[] = useMemo(() => {
    console.log("Influencer Messages - Raw conversations:", conversations);
    const contacts = conversations.map((conv) => ({
      id: conv.user.id, // ✅ This is user_id, safe for WebSocket
      username: conv.user.username,
      email: conv.user.email,
      role: conv.user.role,
      lastMessage: conv.lastMessage?.content,
      unreadCount: conv.unreadCount,
      isOnline: false, // You can add online status via WebSocket presence if backend supports it
      lastMessageTime: conv.lastMessage
        ? formatLastMessageTime(conv.lastMessage.sent_at)
        : undefined,
    }));
    console.log("Influencer Messages - Converted contacts:", contacts);
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
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "??";
    
    return name
      .split(" ")
      .filter((n) => n.length > 0) // Filter out empty strings
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??"; // Fallback if result is empty
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
  if (loading || conversationsLoading) {
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
    <div className="fixed inset-0 left-64 bg-white z-10">
      <div className="flex h-full w-full">
        {/* ── LEFT PANEL – contact list (360px width) ─────────────────────── */}
        <div
          className={`
            ${selectedContact ? "hidden md:flex" : "flex"}
            flex-col
            w-full md:w-[360px]
            border-r border-gray-200 bg-white
            h-full
            transition-all duration-300
          `}
        >
          {/* Fixed: panel header */}
          <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Edit size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Fixed: search bar */}
          <div className="flex-shrink-0 px-4 py-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search Messenger"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-gray-200 transition-colors placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Fixed: tabs */}
          <div className="flex-shrink-0 px-4 pb-2 border-b border-gray-200">
            <div className="flex gap-2">
              {[
                { key: "all", label: "All" },
                { key: "unread", label: "Unread" },
                { key: "groups", label: "Groups" },
                { key: "communities", label: "Communities" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable: contact list */}
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading && chatContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <User size={48} className="text-gray-300 mb-2" />
                <p className="text-gray-600 font-medium">
                  {searchQuery ? "No chats found" : "No messages"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? "Try a different search" : "Start a conversation"}
                </p>
              </div>
            ) : (
              <div>
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      console.log("Contact selected:", contact);
                      setSelectedContact(contact);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors ${
                      selectedContact?.id === contact.id ? "bg-gray-100" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                        {getInitials(contact.username)}
                      </div>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {contact.unreadCount > 9 ? "9+" : contact.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <h3
                          className={`font-medium truncate ${
                            contact.unreadCount && contact.unreadCount > 0
                              ? "text-gray-900 font-semibold"
                              : "text-gray-900"
                          }`}
                        >
                          {contact.username}
                        </h3>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {contact.lastMessageTime}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center">
                        {contact.lastMessage && (
                          <p
                            className={`text-sm truncate ${
                              contact.unreadCount && contact.unreadCount > 0
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {contact.lastMessage}
                          </p>
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
              <div className="flex-shrink-0 px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold">
                      {getInitials(selectedContact.username)}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-base">
                      {selectedContact.username}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedContact.isOnline ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-purple-600">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-purple-600">
                    <Video size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <Info size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable: messages */}
              <div className="flex-1 overflow-hidden">
                <ChatRoom
                  otherUserId={selectedContact.id}
                  otherUserName={selectedContact.username}
                />
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center bg-white">
              <div className="text-center">
                <MessageCircle
                  size={80}
                  className="mx-auto text-gray-300 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Your Messages
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Send messages to brands and manage all your conversations
                  in one place
                </p>
                  </div>
                </div>
              )}
          </div>
      </div>
    </div>
  );
}
