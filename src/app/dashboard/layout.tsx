"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SideBar from "@/components/dashboard/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, authenticated } = useAuthProtection();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />

      <main className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
