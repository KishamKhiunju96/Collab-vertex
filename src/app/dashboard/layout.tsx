"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { MobileSidebar } from "@/components/dashboard/sidebar/MobileSidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar/SidebarProvider";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { loading, authenticated, role } = useAuthProtection();

  if (loading || !authenticated || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-lg text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

return (
  <SidebarProvider>
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Sidebar */}
      <MobileSidebar />
      
      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <aside className="hidden lg:flex w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content - Full width on mobile, adjusted for sidebar on desktop */}
      <main className="flex-1 p-3 sm:p-4 lg:p-5 overflow-auto relative pt-16 lg:pt-4 bg-gray-50">
        {children}
      </main>
    </div>
  </SidebarProvider>
);
}
