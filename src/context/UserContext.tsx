"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AxiosError } from "axios";
import { userService } from "@/api/services/userService";
import { User } from "@/types/user";

interface ApiErrorResponse {
  detail?: string;
}

interface UserContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  refetch: () => Promise<void>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  // Fetch user from API - only called once
  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.me();
      setUser(response.data as User);
      setHasFetched(true);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setUser(null);

      // Don't set error for 401 (unauthorized) - this is expected on login page
      if (axiosError.response?.status !== 401) {
        setError(axiosError.response?.data?.detail ?? "Failed to fetch user");
      }

      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - function never changes

  // Fetch user on mount - only once
  useEffect(() => {
    if (!hasFetched) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update user partially
  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
  }, []);

  // Force refetch (for logout or profile updates)
  const refetch = useCallback(async () => {
    setHasFetched(false);
    setLoading(true);
    try {
      const response = await userService.me();
      setUser(response.data as User);
      setHasFetched(true);
      setError(null); // Clear any previous errors on successful fetch
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setUser(null);

      // Don't set error for 401 (unauthorized) - this is expected when not logged in
      if (axiosError.response?.status !== 401) {
        setError(axiosError.response?.data?.detail ?? "Failed to fetch user");
      }

      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: UserContextValue = {
    user,
    loading,
    error,
    setUser,
    updateUser,
    refetch,
    isAuthenticated: Boolean(user),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
