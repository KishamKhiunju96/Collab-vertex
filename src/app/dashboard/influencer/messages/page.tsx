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

export default function InfluencerMessagesPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  useEffect(() => {
    const fetchChatableBrands = async () => {
      try {
        setIsLoadingContacts(true);
        const response = await axiosInstance.get(API_PATHS.INFLUENCER.GET_CHATABLE_BRANDS);
        
        console.log("🔍 Influencer: Raw chatable brands response:", response.data);
        
        // Map backend response to ChatContact format
        // IMPORTANT: Use user_id (not profile id) for creating conversations
        // When conversation is created, backend automatically sets:
        // - For DIRECT chats: conversation.name = other person's username
        // - For GROUP chats: conversation.name = group name
        const contactsData = response.data
          .filter((brand: any) => {
            // CRITICAL FIX: Only include brands with user_id
            // Never fallback to profile id as it causes 403 errors
            if (!brand.user_id) {
              console.warn("⚠️ Skipping brand without user_id:", {
                profile_id: brand.id,
                name: brand.name,
                message: "Backend must return user_id field for chat authorization"
              });
              return false;
            }
            return true;
          })
          .map((brand: any) => ({
            id: brand.user_id, // Use ONLY user_id for authorization (never profile id)
            username: brand.name || brand.username || "Unknown Brand",
            email: brand.email,
            role: "brand",
            isOnline: false,
          }));
        
        console.log("✅ Influencer: Processed contacts with user_ids:", contactsData.map((c: any) => ({
          id: c.id,
          username: c.username
        })));
        
        setContacts(contactsData);
      } catch (error) {
        console.error("Failed to fetch chatable brands:", error);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    if (authenticated && role === "influencer") {
      fetchChatableBrands();
    }
  }, [authenticated, role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!authenticated || role !== "influencer") {
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
