"use client";

import { useEffect, useState, useCallback } from "react";
import { chatService } from "@/api/services/chatService";
import { ChatConversation } from "@/chat/types";
import { notify } from "@/utils/notify";

interface UseConversationsReturn {
  conversations: ChatConversation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for managing chat conversations
 * Fetches the list of users the current user has chatted with
 *
 * REQUIRES BACKEND ENDPOINT: GET /chat/conversations
 */
export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      const errorMessage =
        error?.response?.status === 404
          ? "Conversations endpoint not implemented. Please contact backend team."
          : "Failed to load conversations";

      setError(errorMessage);
      console.error("Error fetching conversations:", err);

      // Don't show error notification for 404 (endpoint not implemented)
      if (error?.response?.status !== 404) {
        notify.error(errorMessage);
      }

      // Set empty array so UI can still render
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    refetch: fetchConversations,
  };
}
