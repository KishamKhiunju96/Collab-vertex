import { create } from "zustand";
import { ConversationMessage } from "@/chat/types";

/**
 * Chat Store - Per-Conversation Message Storage
 * 
 * CRITICAL FIX: Messages are now stored per conversation_id to prevent messages from
 * appearing in wrong conversations when multiple chats are open simultaneously.
 * 
 * Architecture:
 * - messagesByConversation: Map<conversation_id, ConversationMessage[]>
 * - Each conversation has its own isolated message array
 * - Messages are filtered by conversation_id before storage
 * - Delivery and read receipts update only the correct conversation's messages
 * - Online status tracking for real-time user presence
 */
interface ChatState {
  // Per-conversation message storage: { "conversation-id": [...messages] }
  messagesByConversation: Record<string, ConversationMessage[]>;
  
  // Online status tracking: { "user-id": boolean }
  onlineUsers: Record<string, boolean>;
  
  // Last message update time for conversations: { "conversation-id": timestamp }
  conversationLastUpdated: Record<string, string>;
  
  // Initialize a conversation with an empty array
  initConversation: (conversationId: string) => void;
  
  // Add message to specific conversation
  addMessage: (conversationId: string, msg: ConversationMessage) => void;
  
  // Set all messages for a conversation (e.g., from API fetch)
  setMessages: (conversationId: string, messages: ConversationMessage[]) => void;
  
  // Update message delivery status for specific conversation
  updateMessageDeliveryStatus: (
    conversationId: string,
    messageId: string,
    deliveredToUserId: string
  ) => void;
  
  // Update message read status for specific conversation
  updateMessageReadStatus: (
    conversationId: string,
    messageId: string,
    readByUserId: string
  ) => void;
  
  // Mark all messages in conversation as read by a user
  markConversationAsReadByUser: (
    conversationId: string,
    userId: string,
    currentUserId: string
  ) => void;
  
  // Set user online status
  setUserOnlineStatus: (userId: string, isOnline: boolean) => void;
  
  // Get user online status
  isUserOnline: (userId: string) => boolean;
  
  // Update conversation last message time
  updateConversationTime: (conversationId: string, timestamp: string) => void;
  
  // Clear messages for specific conversation
  clearConversationMessages: (conversationId: string) => void;
  
  // Clear all messages (for logout, etc.)
  clearAllMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByConversation: {},
  onlineUsers: {},
  conversationLastUpdated: {},
  
  addMessage: (conversationId: string, msg: ConversationMessage) => {
    set((state) => {
      // Ensure conversation exists in store
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      
      const conversationMessages = state.messagesByConversation[conversationId];
      
      // Prevent duplicate messages
      const messageExists = conversationMessages.some((m) => m.id === msg.id);
      if (messageExists) {
        return state;
      }
      
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [...conversationMessages, msg],
        },
      };
    });
  },
  
  setMessages: (conversationId: string, messages: ConversationMessage[]) => {
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages.length > 0 ? messages : [],
      },
    }));
  },
  
  // Initialize a conversation with an empty array if it doesn't exist
  initConversation: (conversationId: string) => {
    set((state) => {
      if (state.messagesByConversation[conversationId]) {
        return state; // Already initialized
      }
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [],
        },
      };
    });
  },
  
  updateMessageDeliveryStatus: (
    conversationId: string,
    messageId: string,
    deliveredToUserId: string
  ) => {
    set((state) => {
      const conversationMessages = state.messagesByConversation[conversationId];
      if (!conversationMessages) return state;
      
      const updatedMessages = conversationMessages.map((msg) => {
        if (msg.id === messageId) {
          // Get existing delivered_to array or empty array
          const currentDeliveredTo = msg.delivered_to || [];
          
          // Add user to array if not already present
          if (!currentDeliveredTo.includes(deliveredToUserId)) {
            return {
              ...msg,
              delivered_to: [...currentDeliveredTo, deliveredToUserId],
              is_delivered: true,
            };
          }
        }
        return msg;
      });
      
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: updatedMessages,
        },
      };
    });
  },
  
  updateMessageReadStatus: (
    conversationId: string,
    messageId: string,
    readByUserId: string
  ) => {
    set((state) => {
      const conversationMessages = state.messagesByConversation[conversationId];
      if (!conversationMessages) return state;
      
      const updatedMessages = conversationMessages.map((msg) => {
        if (msg.id === messageId) {
          // Get existing read_by array or empty array
          const currentReadBy = msg.read_by || [];
          
          // Add user to array if not already present
          if (!currentReadBy.includes(readByUserId)) {
            return {
              ...msg,
              read_by: [...currentReadBy, readByUserId],
              is_read: true,
            };
          }
        }
        return msg;
      });
      
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: updatedMessages,
        },
      };
    });
  },
  
  clearConversationMessages: (conversationId: string) => {
    set((state) => {
      const { [conversationId]: _, ...rest } = state.messagesByConversation;
      return { messagesByConversation: rest };
    });
  },
  
  clearAllMessages: () => {
    set({ messagesByConversation: {}, onlineUsers: {}, conversationLastUpdated: {} });
  },
  
  setUserOnlineStatus: (userId: string, isOnline: boolean) => {
    set((state) => ({
      onlineUsers: {
        ...state.onlineUsers,
        [userId]: isOnline,
      },
    }));
  },
  
  isUserOnline: (userId: string) => {
    return get().onlineUsers[userId] || false;
  },
  
  updateConversationTime: (conversationId: string, timestamp: string) => {
    set((state) => ({
      conversationLastUpdated: {
        ...state.conversationLastUpdated,
        [conversationId]: timestamp,
      },
    }));
  },
  
  markConversationAsReadByUser: (
    conversationId: string,
    userId: string,
    currentUserId: string
  ) => {
    set((state) => {
      const conversationMessages = state.messagesByConversation[conversationId];
      if (!conversationMessages) {
        console.warn(`⚠️ No messages found for conversation ${conversationId}`);
        return state;
      }
      
      let updatedCount = 0;
      
      // Mark all messages sent by current user as read by userId
      const updatedMessages = conversationMessages.map((msg) => {
        // Only update messages sent by the current user
        if (msg.sender_id === currentUserId) {
          const currentReadBy = msg.read_by || [];
          
          // Add user to read_by array if not already present
          if (!currentReadBy.includes(userId)) {
            updatedCount++;
            return {
              ...msg,
              read_by: [...currentReadBy, userId],
              is_read: true,
            };
          }
        }
        return msg;
      });
      
      console.log(`📝 Store updated: ${updatedCount} messages marked as read by ${userId} in conversation ${conversationId}`);
      
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: updatedMessages,
        },
      };
    });
  },
}));
