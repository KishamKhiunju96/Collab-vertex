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
    <div className="space-y-6">
      <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-900">
          Hi! {user?.username}, Welcome to Collab Vertex 👋
        </h1>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search brands"
            className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="px-4 py-2 border text-text-primary rounded-lg hover:bg-green-500 hover:text-white transition"
            >
              Profile
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                <Link
                  href="/influencer-dashboard/profile"
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-green-100"
                  onClick={() => setOpen(false)}
                >
                  My Profile
                </Link>

                <button
                  onClick={authService.logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Active Events" value="5" />
        <DashboardCard title="Collaborations" value="12" />
        <DashboardCard title="Total Earnings" value="$1,250" />
      </section>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
