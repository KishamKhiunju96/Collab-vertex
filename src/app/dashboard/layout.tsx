"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { MobileSidebar } from "@/components/dashboard/sidebar/MobileSidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar/SidebarProvider";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { loading, authenticated, role } = useAuthProtection();

  if (loading || !authenticated || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <span className="text-lg text-gray-600 font-medium">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
        {/* Desktop Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="min-h-screen">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
