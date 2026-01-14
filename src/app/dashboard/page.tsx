"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axiosInstance";
import { clearToken } from "@/utils/authToken";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const resolveDashboard = async () => {
      try {
        const res = await api.get("/user/me");
        const role = res.data.role;

        if (!role) throw new Error("Role not found");

        router.replace(`/dashboard/${role}`);
      } catch (error) {
        clearToken();
        router.replace("/login");
      }
    };

    resolveDashboard();
  }, [router]);

  return <p>Redirecting...</p>;
}
