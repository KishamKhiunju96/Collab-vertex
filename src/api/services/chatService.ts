import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { ChatMessage, GetMessagesParams } from "@/chat/types";

/**
 * Chat Service - REST API operations
 * WebSocket operations are handled separately in the chat hooks
 */

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

    const response = await api.get<ChatMessage[]>(
      API_PATHS.CHAT.GET_MESSAGES(otherUserId),
      {
        params: { limit, offset },
      },
    );

    return response.data;
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
   * Note: You may need to add this endpoint to your backend
   */
  async getConversations(): Promise<never[]> {
    // This would require a backend endpoint to get list of users
    // the current user has chatted with
    console.warn("getConversations endpoint not implemented in backend");
    return [];
  },
};
