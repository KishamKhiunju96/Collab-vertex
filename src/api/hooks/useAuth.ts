"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken, UserRole } from "@/utils/authToken";

export function useAuthProtection() {
  const router = useRouter();

  const user = getUserFromToken();

  const state = useMemo<{
    loading: boolean;
    authenticated: boolean;
    role: UserRole | null;
  }>(() => {
    if (!user) {
      return {
        loading: false,
        authenticated: false,
        role: null,
      };
    }

    return {
      loading: false,
      authenticated: true,
      role: user.role,
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  return state;
}

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();

    if (user) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [router]);
}
