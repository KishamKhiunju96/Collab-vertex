"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import { useAuthProtection } from "@/api/hooks/useAuth";
import { navConfig } from "./navConfig";
import { SidebarNav } from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileSidebar() {
  const { isOpen, isMobile, close, toggle } = useSidebar();
  const { role } = useAuthProtection();

  if (!role || !isMobile) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      {/* Mobile Menu Toggle Button */}
      <SheetTrigger asChild>
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-xl active:scale-95"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] p-0">
        {/* Sidebar Header */}
        <div className="sidebar-header border-b border-white/10">
          <Link href="/" className="sidebar-logo" onClick={close}>
            <div className="sidebar-logo-icon">
              <span>C</span>
            </div>
            <span className="sidebar-logo-text">Collab Vertex</span>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <div className="sidebar-nav flex-1 overflow-y-auto py-4">
          <SidebarNav items={navConfig[role]} />
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10">
          <SidebarFooter role={role} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
