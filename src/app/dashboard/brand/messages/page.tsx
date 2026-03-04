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
        
        // Map backend response to ChatContact format
        // IMPORTANT: Use user_id (not profile id) for creating conversations
        // When conversation is created, backend automatically sets:
        // - For DIRECT chats: conversation.name = other person's username
        // - For GROUP chats: conversation.name = group name
        const contactsData = response.data.map((influencer: any) => ({
          id: influencer.user_id || influencer.id, // Use user_id for authorization
          username: influencer.name || influencer.username || "Unknown User",
          email: influencer.email,
          role: "influencer",
          isOnline: false,
        }));
        
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
    <div className="h-full -m-4 lg:-m-6">
      <ConversationChatContainer
        contacts={contacts}
        isLoadingContacts={isLoadingContacts}
      />
    </div>
  );
}