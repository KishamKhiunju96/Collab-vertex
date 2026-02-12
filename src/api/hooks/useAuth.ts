"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export type UserRole = "brand" | "influencer" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
}

/**
 * Hook to protect routes and ensure user is authenticated
 * Now uses UserContext to prevent duplicate API calls
 */
export function useAuthProtection() {
  const router = useRouter();
  const { user, loading, error } = useUser();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Wait for user data to load
    if (loading) return;

    // If there's no user (regardless of error), redirect to login (only once)
    // This is expected behavior on dashboard pages when user is not authenticated
    if (!user && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.replace("/login");
    }

    // Reset redirect flag if user becomes authenticated
    if (user) {
      hasRedirectedRef.current = false;
    }
  }, [user, loading, router]);

  return {
    loading,
    authenticated: Boolean(user),
    role: user?.role ?? null,
    user,
  };
}
