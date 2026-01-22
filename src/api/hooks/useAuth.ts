"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axiosInstance";

export type UserRole = "brand" | "influencer" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
}

export function useAuthProtection() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<User>("/user/me", { withCredentials: true });
        setAuthenticated(true);
        setRole(res.data.role);
      } catch (err) {
        setAuthenticated(false);
        setRole(null);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { loading, authenticated, role };
}
