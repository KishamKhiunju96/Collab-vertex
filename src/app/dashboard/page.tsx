"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Wait for user data to load
    if (loading) return;

    // Prevent multiple redirects
    if (hasRedirectedRef.current) return;

    // If no user, redirect to login
    if (!user) {
      hasRedirectedRef.current = true;
      router.replace("/login");
      return;
    }

    // Redirect based on role
    if (user.role) {
      hasRedirectedRef.current = true;
      router.replace(`/dashboard/${user.role}`);
    } else {
      console.error("User role not found");
      hasRedirectedRef.current = true;
      router.replace("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <span className="text-lg text-gray-600">
          {loading ? "Loading..." : "Redirecting to your dashboard..."}
        </span>
      </div>
    </div>
  );
}
