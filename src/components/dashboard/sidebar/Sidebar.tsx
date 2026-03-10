"use client";

import Link from "next/link";
import { useAuthProtection } from "@/api/hooks/useAuth";
import { navConfig } from "./navConfig";
import SidebarFooter from "./SidebarFooter";
import { SidebarNav } from "./SidebarNav";

export default function Sidebar() {
  const { role } = useAuthProtection();

  if (!role) return null;

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:shadow-sm">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-gray-200 px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            C
          </div>
          <span className="text-base font-semibold text-gray-900">
            Collab Vertex
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <SidebarNav items={navConfig[role]} />
      </div>

      {/* Footer */}
      <SidebarFooter role={role} />
    </aside>
  );
}