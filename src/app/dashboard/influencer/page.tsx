"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import { useUserData } from "@/api/hooks/useUserData";
import { authService } from "@/api/services/authService";
import Link from "next/link";
import { useState } from "react";

export default function InfluencerDashboardPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const { user } = useUserData();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="text-lg">Loading Influencer Dashboard...</span>
      </div>
    );
  }
  if (!authenticated || role !== "influencer") {
    return null;
  }

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-b-2xl">
      <h1 className="text-2xl font-bold text-gray-900">
        {loading ? "Hi.." : `Hi! ${user?.username}, Welcome to Collab Vertex`}x
      </h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="search Events"
          className="px-4 py-2 rounded-lg border-2  focus:outline-none focus:ring-2 focus:ring-green-500"
        ></input>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 text-black rounded-lg border hover:bg-green-500 transition"
          >
            Profile
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm hover:bg-green-300"
                onClick={() => setOpen(false)}
              >
                My Profile
              </Link>

              <button
                onClick={authService.logout}
                className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-green-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
