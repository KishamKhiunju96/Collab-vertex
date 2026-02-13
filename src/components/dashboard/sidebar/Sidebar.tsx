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
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <span>C</span>
          </div>
          <span className="sidebar-logo-text">Collab Vertex</span>
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <div className="sidebar-nav">
        <SidebarNav items={navConfig[role]} />
      </div>

      {/* Sidebar Footer */}
      <SidebarFooter role={role} />
    </aside>
  );
}
