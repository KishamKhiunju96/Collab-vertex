"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import Link from "next/link";

export default function SideBar() {
  const { role } = useAuthProtection();

  return (
    <aside className="w-64 h-full bg-background-light p-6 border-r">
      <h2 className="text-text-primary">Collab Vertex</h2>

      <nav className="flex flex-col">
        {role === "brand" && (
          <>
            <Link
              href="/dashboard/brand"
              className="px-4 py-3 hover:bg-gray-800/50 text-text-primary rounded-lg transition-colors"
            >
              Brands
            </Link>
            <Link
              href="/dashboard/brand/events"
              className="px-4 py-3 hover:bg-gray-800/50 text-text-primary rounded-lg transition-colors"
            >
              Events
            </Link>
            <Link
              href="/dashboard/brand/influencers"
              className="px-4 py-3 hover:bg-gray-800/50 text-text-primary rounded-lg transition-colors"
            >
              Influencers
            </Link>
          </>
        )}

        {role === "influencer" && (
          <>
            <Link href="/dashboard/influencer">Dashboard</Link>
            <Link href="/dashboard/influencer/events">Events</Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link href="/dashboard/admin">Admin Pannel</Link>
            <Link href="/dashboard/admin/users">Users</Link>
          </>
        )}
      </nav>
    </aside>
  );
}
