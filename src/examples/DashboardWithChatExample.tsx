"use client";

/**
 * EXAMPLE: How to integrate conversation-based chat into your dashboard
 * 
 * This file shows how to:
 * 1. Fetch available users for chat
 * 2. Use FloatingConversationChatButton
 * 3. Calculate unread counts (optional)
 * 
 * Copy this pattern into your BrandDashboardPage or InfluencerDashboard
 */

import { useEffect, useState } from "react";
import FloatingConversationChatButton from "@/chat/components/FloatingConversationChatButton";
import { useConversations } from "@/chat/hooks/useConversationsList";
import { useUserData } from "@/api/hooks/useUserData";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  isOnline?: boolean;
}

export default function ExampleDashboardWithChat() {
  const { user } = useUserData();
  const [chatContacts, setChatContacts] = useState<ChatContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  // Get total unread count from conversations
  const { conversations } = useConversations();
  const totalUnreadCount = conversations.reduce(
    (sum, conv) => sum + conv.unread_count,
    0
  );

  // Fetch available users for chat
  useEffect(() => {
    async function fetchChatContacts() {
      try {
        if (!user) return;

        // METHOD 1: Fetch from your API
        // Example: GET /api/users/for-chat (you need to create this endpoint)
        /*
        const response = await fetch("/api/users/for-chat");
        const data = await response.json();
        
        const contacts = data.results.map((u: any) => ({
          id: u.profile_id,      // IMPORTANT: Use profile UUID (from chatable endpoints)
          username: u.username,
          email: u.email,
          role: u.role,          // "brand" | "influencer"
          isOnline: u.is_online || false
        }));
        */

        // METHOD 2: Use existing API endpoints
        // For Brand dashboard: fetch influencers
        // For Influencer dashboard: fetch brands or all users

        if (user.role === "brand") {
          // Fetch influencers using chatable_influencers endpoint
          const response = await fetch("/api/brand/chatable_influencers");
          const data = await response.json();

          const contacts: ChatContact[] = data.map((profile: any) => ({
            id: profile.id, // Profile UUID from backend (this is what we need!)
            username: profile.name || "Influencer",
            email: profile.email,
            role: "influencer",
            isOnline: false,
          }));

          setChatContacts(contacts);
        } else if (user.role === "influencer") {
          // Fetch brands using chatable_brands endpoint
          const response = await fetch("/api/influencer/chatable_brands");
          const data = await response.json();

          const contacts: ChatContact[] = data.map((profile: any) => ({
            id: profile.id, // Profile UUID from backend (this is what we need!)
            username: profile.name,
            email: profile.email,
            role: "brand",
            isOnline: false,
          }));

          setChatContacts(contacts);
        }
      } catch (error) {
        console.error("Failed to fetch chat contacts:", error);
      } finally {
        setIsLoadingContacts(false);
      }
    }

    fetchChatContacts();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your Dashboard Content */}
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Your dashboard components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            {/* Your content */}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Events</h2>
            {/* Your content */}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            {/* Your content */}
          </div>
        </div>
      </div>

      {/* Floating Chat Button - Add this at the end */}
      <FloatingConversationChatButton
        contacts={chatContacts}
        isLoading={isLoadingContacts}
        unreadTotal={totalUnreadCount}
      />
    </div>
  );
}

/**
 * INTEGRATION STEPS:
 * 
 * 1. Copy the FloatingConversationChatButton component call to your dashboard
 * 2. Update the fetchChatContacts function to fetch from your API
 * 3. IMPORTANT: Make sure to use user.id (UUID), not profile.id (number)
 * 4. Test by clicking the chat button and selecting a user
 * 
 * TROUBLESHOOTING:
 * 
 * 1. "No contacts" issue:
 *    - Check API response format
 *    - Verify profile IDs are UUIDs (from chatable endpoints)
 *    - Check console for errors
 * 
 * 2. "Failed to create conversation":
 *    - Verify you're using contact.id (profile UUID from chatable_influencers/chatable_brands)
 *    - Check authentication token
 *    - Check backend API is accessible
 * 
 * 3. "WebSocket not connecting":
 *    - Check wss://api.dixam.me is accessible
 *    - Verify conversation_id is valid
 *    - Check browser console for WebSocket errors
 * 
 * 4. "Messages not appearing":
 *    - Check WebSocket connection status
 *    - Verify conversation_id matches
 *    - Check message format from backend
 */

/**
 * ALTERNATIVE: Use standalone conversation container (without floating button)
 * 
 * You can also embed the chat directly in your page:
 */

/*
import ConversationChatContainer from "@/chat/components/ConversationChatContainer";

// In your component:
<div className="h-screen">
  <ConversationChatContainer
    contacts={chatContacts}
    isLoadingContacts={isLoadingContacts}
  />
</div>
*/

/**
 * CUSTOMIZATION OPTIONS:
 * 
 * 1. Change button position:
 *    - Edit FloatingConversationChatButton.tsx
 *    - Change "right-4" to "left-4" for left position
 *    - Change "bottom-6" to adjust vertical position
 * 
 * 2. Change colors:
 *    - All components use purple-600 and pink-600 gradients
 *    - Find/replace to use your brand colors
 *    - Update Tailwind classes throughout
 * 
 * 3. Add group creation UI:
 *    - Create a "Create Group" button
 *    - Show modal with participant selection
 *    - Call createGroupConversation from useConversations hook
 * 
 * 4. Add notifications:
 *    - Listen to WebSocket messages
 *    - Show browser notification when new message arrives
 *    - Play sound (optional)
 */
