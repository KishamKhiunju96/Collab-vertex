import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { 
  ChatMessage, 
  GetMessagesParams, 
  ChatConversation,
  Conversation,
  ConversationMessage,
  CreateDirectConversationPayload,
  CreateGroupConversationPayload,
  AddParticipantsPayload,
  SendMessagePayload,
} from "@/chat/types";
import { ChatableInfluencer, ChatableBrand } from "@/chat/types/chatable";

/**
 * Chat Service - REST API operations for conversation-based messaging
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
  async getMessages(
    otherUserId: string,
    params?: GetMessagesParams,
  ): Promise<ChatMessage[]> {
    console.warn("⚠️ chatService.getMessages() is deprecated");
    
    // This method no longer has a backend endpoint
    // Return empty array to prevent errors
    return [];
  },
  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    // This would require a backend endpoint
    // For now, marking as read is handled via WebSocket
    console.log("Mark as read:", messageIds);
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

  /**
   * Mark all messages as delivered for the current user
   * This should be called when the user logs in or becomes active
   */
  async markAllDelivered(): Promise<void> {
    try {
      await api.post(API_PATHS.CHAT.MARK_ALL_DELIVERED);
      console.log("✅ All messages marked as delivered");
    } catch (error) {
      console.error("Failed to mark messages as delivered:", error);
      // Don't throw - this is not critical
    }
  },

  // ===================================================================
  //  NEW CONVERSATION-BASED API METHODS
  // ===================================================================

  /**
   * Create a direct (one-to-one) conversation
   * @param payload - Contains other_user_id (user UUID from Users table)
   * @returns Promise<Conversation>
   * 
   * IMPORTANT: Field name is 'other_user_id' and expects user UUID from Users table
   * - Get user UUIDs from chatable_influencers or chatable_brands endpoints (user_id field)
   * - Example: { other_user_id: contact.user_id } where contact.user_id is the user UUID
   * - Backend authorization checks are based on user_id, not profile_id
   */
  async createDirectConversation(
    payload: CreateDirectConversationPayload
  ): Promise<Conversation> {
    try {
      console.log("=== Creating Direct Conversation ===");
      console.log("Endpoint:", API_PATHS.CHAT.CREATE_DIRECT_CONVERSATION);
      console.log("Payload:", JSON.stringify(payload, null, 2));
      console.log("Payload field name:", Object.keys(payload));
      console.log("Payload other_user_id value:", payload.other_user_id);
      console.log("===================================");
      
      const response = await api.post<Conversation>(
        API_PATHS.CHAT.CREATE_DIRECT_CONVERSATION,
        payload
      );
      console.log("✅ Created direct conversation:", response.data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Create a group conversation
   * @param payload - Contains name, participant_ids (user UUIDs), description, avatar_url
   * @returns Promise<Conversation>
   * 
   * IMPORTANT: Field name is 'participant_ids' and expects user UUIDs from Users table
   * - Get user UUIDs from chatable_influencers or chatable_brands endpoints (user_id field)
   * - Example: { name: "Team Chat", participant_ids: [contact1.user_id, contact2.user_id] }
   */
  async createGroupConversation(
    payload: CreateGroupConversationPayload
  ): Promise<Conversation> {
    try {
      const response = await api.post<Conversation>(
        API_PATHS.CHAT.CREATE_GROUP_CONVERSATION,
        payload
      );
      console.log("Created group conversation:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to create group conversation:", error);
      throw error;
    }
  },

  /**
   * Get all conversations for the current user
   * @returns Promise<Conversation[]>
   */
  async getConversationsList(): Promise<Conversation[]> {
    try {
      console.log("Fetching conversations from:", API_PATHS.CHAT.GET_CONVERSATIONS_LIST);
      const response = await api.get<Conversation[]>(
        API_PATHS.CHAT.GET_CONVERSATIONS_LIST
      );
      console.log("✅ Fetched conversations:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to fetch conversations");
      console.error("Error details:", {
        status: error.response?.status,
        message: error.response?.data?.detail || error.message,
        endpoint: API_PATHS.CHAT.GET_CONVERSATIONS_LIST
      });
      
      // Return empty array instead of throwing - allows UI to work even if endpoint fails
      // User can still create new conversations
      console.warn("⚠️ Returning empty conversations array - endpoint may not be implemented");
      return [];
    }
  },

  /**
   * Get messages for a specific conversation
   * @param conversationId - The conversation ID
   * @param params - Pagination parameters
   * @returns Promise<ConversationMessage[]>
   */
  async getConversationMessages(
    conversationId: string,
    params?: GetMessagesParams
  ): Promise<ConversationMessage[]> {
    const { limit = 50, offset = 0 } = params || {};

    try {
      const response = await api.get<ConversationMessage[]>(
        API_PATHS.CHAT.GET_CONVERSATION_MESSAGES(conversationId),
        {
          params: { limit, offset },
        }
      );

      console.log("📨 Fetched conversation messages:", {
        conversationId,
        messageCount: response.data?.length,
        firstMessage: response.data?.[0] ? {
          sender_id: response.data[0].sender_id,
          receiver_id: response.data[0].receiver_id,
          content: response.data[0].content?.substring(0, 30),
        } : null,
      });

      if (!Array.isArray(response.data)) {
        console.warn("⚠️ Response data is not an array");
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Failed to get conversation messages:", error);
      return [];
    }
  },

  /**
   * Send a message to a conversation (via REST API - for offline messages)
   * For real-time messages, use WebSocket
   * @param conversationId - The conversation ID
   * @param payload - Message content and type
   * @returns Promise<ConversationMessage>
   */
  async sendConversationMessage(
    conversationId: string,
    payload: SendMessagePayload
  ): Promise<ConversationMessage> {
    try {
      const response = await api.post<ConversationMessage>(
        API_PATHS.CHAT.GET_CONVERSATION_MESSAGES(conversationId),
        payload
      );
      console.log("Sent message:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  /**
   * Mark a conversation as read (REST API)
   * 
   * ✅ This is intentionally called when opening a conversation
   * Backend marks all messages as read and sends read_receipt events to other participants
   * 
   * USAGE: Call when user opens/navigates to a conversation
   * - Marks ALL messages in the conversation as read
   * - Sends read_receipt WebSocket events to senders
   * - Updates delivered_to and read_by arrays in real-time
   * 
   * @param conversationId - The conversation ID
   * @returns Promise<void>
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      await api.patch(API_PATHS.CHAT.MARK_CONVERSATION_READ(conversationId));
      console.log("✅ Marked conversation as read (REST API):", conversationId);
    } catch (error) {
      console.error("Failed to mark conversation as read (REST API):", error);
      throw error; // Throw to allow error handling in caller
    }
  },

  /**
   * Add participants to a group conversation
   * @param conversationId - The conversation ID
   * @param payload - Contains user_ids array
   * @returns Promise<void>
   */
  async addParticipants(
    conversationId: string,
    payload: AddParticipantsPayload
  ): Promise<void> {
    try {
      await api.post(
        API_PATHS.CHAT.ADD_PARTICIPANTS(conversationId),
        payload
      );
      console.log("Added participants:", payload.user_ids);
    } catch (error) {
      console.error("Failed to add participants:", error);
      throw error;
    }
  },

  /**
   * Remove a participant from a group conversation
   * @param conversationId - The conversation ID
   * @param userId - The user ID to remove
   * @returns Promise<void>
   */
  async removeParticipant(
    conversationId: string,
    userId: string
  ): Promise<void> {
    try {
      await api.delete(
        API_PATHS.CHAT.REMOVE_PARTICIPANT(conversationId, userId)
      );
      console.log("Removed participant:", userId);
    } catch (error) {
      console.error("Failed to remove participant:", error);
      throw error;
    }
  },
};

