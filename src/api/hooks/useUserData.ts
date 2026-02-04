"use client";
import { useEffect, useCallback, useState } from "react";
import { AxiosError } from "axios";

import { userService } from "@/api/services/userService";
import { User } from "@/types/user";

interface ApiErrorResponse {
  detail?: string;
}

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user from API
  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.me();

      setUser(response.data as User);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;

      setUser(null);
      setError(axiosError.response?.data?.detail ?? "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Expose setUser safely for updating user state
  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
  };

  return {
    user,
    setUser: updateUser, // <-- now available
    loading,
    error,
    refetch: fetchUser,
    isAuthenticated: Boolean(user),
  };
}
