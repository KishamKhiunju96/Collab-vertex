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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">
              C
            </span>
          </div>
          <span className="text-xl font-bold">Collab Vertex</span>
        </Link>
      </div>

      <SidebarNav items={navConfig[role]} />
      <SidebarFooter role={role} />
    </aside>
  );
}
