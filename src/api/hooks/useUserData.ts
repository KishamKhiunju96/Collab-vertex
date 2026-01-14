import { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { userService } from "@/api/services/userService";

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
}

interface ApiErrorResponse {
  detail?: string;
}

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.me();
      setUser(response.data);
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      setUser(null);
      setError(err.response?.data?.detail ?? "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    isAuthenticated: Boolean(user),
  };
}
