"use client";

import { useState, useEffect } from "react";
import { useAuthProtection } from "@/api/hooks/useAuth";
import { MessageCircle } from "lucide-react";
import ConversationChatContainer from "@/chat/components/ConversationChatContainer";
import axiosInstance from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export default function BrandMessagesPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  useEffect(() => {
    const fetchChatableInfluencers = async () => {
      try {
        setIsLoadingContacts(true);
        const response = await axiosInstance.get(API_PATHS.BRAND.GET_CHATABLE_INFLUENCERS);
        
        console.log("=== Chatable Influencers Response ===");
        console.log("Raw response:", response.data);
        console.log("First influencer:", response.data[0]);
        console.log("Fields in first influencer:", Object.keys(response.data[0] || {}));
        console.log("user_id (for auth):", response.data[0]?.user_id);
        console.log("id (profile):", response.data[0]?.id);
        console.log("=====================================");
        
        // Map backend response to ChatContact format
        // IMPORTANT: Use user_id (not profile id) for creating conversations
        const contactsData = response.data.map((influencer: any) => ({
          id: influencer.user_id || influencer.id, // Use user_id for authorization
          username: influencer.name || influencer.username || "Unknown User",
          email: influencer.email,
          role: "influencer",
          isOnline: false,
        }));
        
        console.log("=== Mapped Contacts ===");
        console.log("First contact:", contactsData[0]);
        console.log("Contact ID (user UUID for auth):", contactsData[0]?.id);
        console.log("======================");
        
        setContacts(contactsData);
      } catch (error) {
        console.error("Failed to fetch chatable influencers:", error);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    if (authenticated && role === "brand") {
      fetchChatableInfluencers();
    }
  }, [authenticated, role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authenticated || role !== "brand") {
    return null;
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Page Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-xs text-gray-600">
              Chat with influencers and manage conversations
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden">
        <ConversationChatContainer
          contacts={contacts}
          isLoadingContacts={isLoadingContacts}
        />
      </div>
    </div>
  );
}