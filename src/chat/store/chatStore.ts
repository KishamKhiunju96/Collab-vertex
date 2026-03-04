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
 */
interface ChatState {
  // Per-conversation message storage: { "conversation-id": [...messages] }
  messagesByConversation: Record<string, ConversationMessage[]>;
  
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
    deliveredTo: string[]
  ) => void;
  
  // Update message read status for specific conversation
  updateMessageReadStatus: (
    conversationId: string,
    messageId: string,
    readBy: string[]
  ) => void;
  
  // Clear messages for specific conversation
  clearConversationMessages: (conversationId: string) => void;
  
  // Clear all messages (for logout, etc.)
  clearAllMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByConversation: {},
  
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
    deliveredTo: string[]
  ) => {
    set((state) => {
      const conversationMessages = state.messagesByConversation[conversationId];
      if (!conversationMessages) return state;
      
      const updatedMessages = conversationMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, delivered_to: deliveredTo, is_delivered: true }
          : msg
      );
      
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
    readBy: string[]
  ) => {
    set((state) => {
      const conversationMessages = state.messagesByConversation[conversationId];
      if (!conversationMessages) return state;
      
      const updatedMessages = conversationMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, read_by: readBy, is_read: true }
          : msg
      );
      
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
    set({ messagesByConversation: {} });
  },
}));
