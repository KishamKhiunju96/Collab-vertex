"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";

export default function BrandDashboardPage() {
  const { loading, authenticated, role } = useAuthProtection();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="text-lg">Loading Brand Dashboard...</span>
      </div>
    );
  }

  if (!authenticated || role !== "brand") {
    return null;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Brand Dashboard</h1>
        <p className="text-gray-500">
          Manage Events, collaborate with influencers, and track performance.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardCard title="Active Events" value="2" />
        <DashboardCard title="Influencers Collaborated" value="15" />
        <DashboardCard title="Total Reach" value="100" />
      </div>

      <div className="flex gap-4">
        <button className="px-4 py-2 rounded-md bg-green-400 text-text-primary hover:bg-green-600">
          Create Events
        </button>
        <button className="px-4 py-2 rounded-md border">
          View Influencers
        </button>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-medium mb-3">Recent Activity</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✔ Event "Tour" created</li>
          <li>✔ Influencer Sushmita joined your event</li>
          <li>✔ Event "Tour" completed</li>
        </ul>
      </div>
    </section>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="border rounded-lg p-4">
      <p className=" font-bold text-gray-700">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
