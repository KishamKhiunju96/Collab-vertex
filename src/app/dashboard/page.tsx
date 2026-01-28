"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axiosInstance";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const resolveDashboard = async () => {
      try {
        const res = await api.get("/user/me");
        const role = res.data.role;

        if (!role) throw new Error("Role not found");

        // Redirect based on role
        router.replace(`/dashboard/${role}`);
      } catch (error) {
        console.error("Dashboard redirect error:", error);
        router.replace("/login");
      }
    };

    resolveDashboard();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <span className="text-lg text-gray-600">
          Redirecting to your dashboard...
        </span>
      </div>
    </div>
  );
}
