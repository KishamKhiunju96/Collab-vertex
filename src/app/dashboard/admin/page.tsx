"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, error } = useUser();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (loading) return;

    // Prevent multiple redirects
    if (hasRedirectedRef.current) return;

    if (error || !user) {
      hasRedirectedRef.current = true;
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      hasRedirectedRef.current = true;
      router.replace("/401");
    }
  }, [user, loading, error, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="text-lg text-gray-600">
          Loading Admin Dashboard...
        </span>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="text-sm text-gray-500">Redirecting...</span>
      </div>
    );
  }

  return (
    <section className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Hi {user.username}, Welcome to Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Manage users, monitor system activity, and configure platform
          settings.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Total Users" value="156" />
        <DashboardCard title="Active Brands" value="42" />
        <DashboardCard title="Active Influencers" value="89" />
      </section>

      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity to display.</p>
      </section>
    </section>
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
