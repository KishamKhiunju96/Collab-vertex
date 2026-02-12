"use client";

import { useUser } from "@/context/UserContext";

/**
 * Hook to access user data from context
 * This replaces the old implementation that made API calls
 * Now it uses the global UserContext to prevent multiple API calls
 */
export function useUserData() {
  const context = useUser();

  return {
    user: context.user,
    setUser: context.setUser,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch,
    isAuthenticated: context.isAuthenticated,
    updateUser: context.updateUser,
  };
}
