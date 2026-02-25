import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { ChatMessage, GetMessagesParams, ChatConversation } from "@/chat/types";
import { ChatableInfluencer, ChatableBrand } from "@/chat/types/chatable";

/**
 * Chat Service - REST API operations
 * WebSocket operations are handled separately in the chat hooks
 */

/**
 * Convert ChatableInfluencer to ChatConversation format
 * IMPORTANT: Maps user_id (NOT profile id) to user.id for WebSocket connections
 */
const influencerToChatConversation = (
  influencer: ChatableInfluencer
): ChatConversation => {
  console.log("Converting influencer to conversation:", {
    profile_id: influencer.id,
    user_id: influencer.user_id,
    name: influencer.name,
    full_object: influencer,
  });
  
  // Validate that backend returned user_id
  if (!influencer.user_id) {
    console.error("❌ BACKEND ERROR: Missing user_id field!");
    console.error("Backend API /brand/chatable_influencers MUST return:");
    console.error({
      user_id: "UUID from Users table", // ← For WebSocket
      id: "UUID from InfluencerProfile table", // ← For display
      name: "Influencer name",
      // ... other fields
    });
    console.error("Received:", influencer);
  }

  return {
    user: {
      // Use user_id if available, otherwise fallback to id with warning
      id: influencer.user_id || influencer.id,
      username: influencer.username || influencer.name || influencer.email || "Influencer",
      email: influencer.email,
      role: "influencer",
    },
    unreadCount: 0,
  };
};

/**
 * Convert ChatableBrand to ChatConversation format
 * IMPORTANT: Maps user_id (NOT profile id) to user.id for WebSocket connections
 */
const brandToChatConversation = (brand: ChatableBrand): ChatConversation => {
  console.log("Converting brand to conversation:", {
    profile_id: brand.id,
    user_id: brand.user_id,
    name: brand.name,
    full_object: brand,
  });
  
  // Validate that backend returned user_id
  if (!brand.user_id) {
    console.error("❌ BACKEND ERROR: Missing user_id field!");
    console.error("Backend API /influencer/chatable_brands MUST return:");
    console.error({
      user_id: "UUID from Users table", // ← For WebSocket
      id: "UUID from BrandProfile table", // ← For display
      name: "Brand name",
      // ... other fields
    });
    console.error("Received:", brand);
  }

  return {
    user: {
      // Use user_id if available, otherwise fallback to id with warning
      id: brand.user_id || brand.id,
      username: brand.username || brand.name || brand.email || "Brand",
      email: brand.email,
      role: "brand",
    },
    unreadCount: 0,
  };
};

export const chatService = {
  /**
   * Get chat message history with another user
   * @param otherUserId - The ID of the other user in the conversation
   * @param params - Pagination parameters (limit, offset)
   * @returns Promise<ChatMessage[]>
   */
  async getMessages(
    otherUserId: string,
    params?: GetMessagesParams,
  ): Promise<ChatMessage[]> {
    const { limit = 50, offset = 0 } = params || {};

    try {
      const response = await api.get<ChatMessage[]>(
        API_PATHS.CHAT.GET_MESSAGES(otherUserId),
        {
          params: { limit, offset },
        },
      );

      console.log("getMessages API response:", { 
        data: response.data, 
        isArray: Array.isArray(response.data),
        type: typeof response.data 
      });

      // Ensure we always return an array
      if (!Array.isArray(response.data)) {
        console.error("❌ API returned non-array data for messages:", response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Failed to get messages:", error);
      return []; // Return empty array on error
    }
  },

  /**
   * Mark messages as read (if you add this endpoint to backend)
   * @param messageIds - Array of message IDs to mark as read
   */
  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    // This would require a backend endpoint
    // For now, marking as read is handled via WebSocket
    console.log("Mark as read:", messageIds);
  },

  /**
   * Get all conversations/chat users
   * Returns list of users the current user has chatted with
   * Note: This endpoint needs to be implemented on the backend
   * The backend should return a list of all users the current user has exchanged messages with
   */
  async getConversations(): Promise<ChatConversation[]> {
    try {
      const response = await api.get<ChatConversation[]>(
        API_PATHS.CHAT.GET_CONVERSATIONS,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      // If the endpoint is not implemented, throw the error
      // The frontend will handle this gracefully
      throw error;
    }
  },

  /**
   * Get chatable influencers for brands
   * Returns influencers who have applied to the brand's events
   */
  async getChatableInfluencers(): Promise<ChatConversation[]> {
    try {
      const response = await api.get<ChatableInfluencer[]>(
        API_PATHS.BRAND.GET_CHATABLE_INFLUENCERS
      );
      console.log("Chatable influencers raw response:", response.data);
      const conversations = response.data.map(influencerToChatConversation);
      console.log("Converted conversations:", conversations);
      return conversations;
    } catch (error) {
      console.error("Failed to fetch chatable influencers:", error);
      throw error;
    }
  },

  /**
   * Get chatable brands for influencers
   * Returns brands whose events the influencer has applied to
   */
  async getChatableBrands(): Promise<ChatConversation[]> {
    try {
      const response = await api.get<ChatableBrand[]>(
        API_PATHS.INFLUENCER.GET_CHATABLE_BRANDS
      );
      console.log("Chatable brands raw response:", response.data);
      const conversations = response.data.map(brandToChatConversation);
      console.log("Converted conversations:", conversations);
      return conversations;
    } catch (error) {
      console.error("Failed to fetch chatable brands:", error);
      throw error;
    }
  },

  /**
   * Get conversations based on user role
   * This is a convenience method that calls the appropriate endpoint
   */
  async getConversationsByRole(role: "brand" | "influencer"): Promise<ChatConversation[]> {
    if (role === "brand") {
      return this.getChatableInfluencers();
    } else {
      return this.getChatableBrands();
    }
  },
};
