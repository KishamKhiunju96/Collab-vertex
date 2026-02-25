"use client";

import { useEffect, useState, useCallback } from "react";
import { chatService } from "@/api/services/chatService";
import { ChatConversation } from "@/chat/types";
import { notify } from "@/utils/notify";
import { useUser } from "@/context/UserContext";

interface UseConversationsReturn {
  conversations: ChatConversation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for managing chat conversations
 * Fetches chatable users based on the current user's role:
 * - Brands get chatable influencers (who have applied to their events)
 * - Influencers get chatable brands (whose events they've applied to)
 */
export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchConversations = useCallback(async () => {
    // Don't attempt to fetch if user is not loaded yet
    if (!user) {
      setIsLoading(false);
      setConversations([]);
      return;
    }

    // Only brands and influencers can use chat
    if (user.role !== "brand" && user.role !== "influencer") {
      setIsLoading(false);
      setConversations([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await chatService.getConversationsByRole(user.role);
      setConversations(data);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      const errorMessage =
        error?.response?.status === 404
          ? "Chat endpoint not found. Please ensure the backend is properly configured."
          : `Failed to load ${user.role === "brand" ? "influencers" : "brands"}`;

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
  }, [user]);

  // Fetch conversations when user changes
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
