"use client";
import { useState } from "react";
import { useAuthProtection } from "@/api/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const { role } = useAuthProtection();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch("/user/logout", {
        method: "POST",
        credentials: "include", // sends cookies/session
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn(`Logout endpoint returned ${response.status}`);
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setIsLoggingOut(false);
      router.push("/login");
    }
  };

  return (
    <aside className="w-64 h-full bg-background-light p-6 border-r border-gray-800 flex flex-col">
      <h2 className="text-text-primary text-xl font-semibold mb-8">
        Collab Vertex
      </h2>

      <nav className="flex flex-col gap-1 flex-grow">
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
            <Link
              href="/dashboard/influencer"
              className="px-4 py-3 hover:bg-gray-800/50 text-text-primary rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/influencer/events"
              className="px-4 py-3 hover:bg-gray-800/50 text-text-primary rounded-lg transition-colors"
            >
              Events
            </Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link
              href="/dashboard/admin"
              className="px-4 py-3 hover:bg-gray-800/50 text-text-primary rounded-lg transition-colors"
            >
              Admin Panel
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="px-4 py-3 hover:bg-gray-800/50 text-text-primary rounded-lg transition-colors"
            >
              Users
            </Link>
          </>
        )}
      </nav>

      {role && (
        <div className="mt-auto pt-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              w-full px-4 py-3 text-left rounded-lg transition-colors font-medium
              ${
                isLoggingOut
                  ? "text-gray-500 cursor-not-allowed bg-gray-900/30"
                  : "text-red-400 hover:bg-red-950/30 hover:text-red-300"
              }
            `}
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      )}
    </aside>
  );
}
