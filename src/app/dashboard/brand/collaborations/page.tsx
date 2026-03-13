"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import { useEffect, useState } from "react";
import {
  Megaphone,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Collaboration {
  id: string;
  influencer_name: string;
  event_title: string;
  status: "pending" | "active" | "completed" | "cancelled";
  start_date: string;
  end_date: string;
  engagement_rate?: number;
}

export default function CollaborationsPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authenticated && role === "brand") {
      setTimeout(() => {
        setCollaborations([]);
        setIsLoading(false);
      }, 1000);
    }
  }, [authenticated, role]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-gray-400" />
          <span className="text-sm text-gray-500">Loading…</span>
        </div>
      </div>
    );
  }

  if (!authenticated || role !== "brand") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-red-600">
        Access denied. Brand accounts only.
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
      case "pending":
        return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
      case "completed":
        return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" };
      case "cancelled":
        return { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
    }
  };

  const stats = [
    {
      label: "Total",
      value: collaborations.length,
      icon: Megaphone,
      color: "text-gray-600",
    },
    {
      label: "Active",
      value: collaborations.filter((c) => c.status === "active").length,
      dot: "bg-emerald-500",
    },
    {
      label: "Pending",
      value: collaborations.filter((c) => c.status === "pending").length,
      dot: "bg-amber-500",
    },
    {
      label: "Completed",
      value: collaborations.filter((c) => c.status === "completed").length,
      dot: "bg-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Collaborations
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your brand collaborations with influencers
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                {stat.icon ? (
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${stat.dot}`} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && collaborations.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <Megaphone className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Collaborations Yet
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Start creating events and connecting with influencers to begin
              your collaborations
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard/brand/events"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                <Calendar className="h-4 w-4" />
                Create Event
              </Link>
              <Link
                href="/dashboard/brand/influencers"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Users className="h-4 w-4" />
                Find Influencers
              </Link>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && collaborations.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Influencer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      End Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {collaborations.map((collab) => {
                    const statusConfig = getStatusConfig(collab.status);
                    return (
                      <tr
                        key={collab.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                              {collab.influencer_name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {collab.influencer_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {collab.event_title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(collab.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(collab.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                            {collab.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {collab.engagement_rate ? (
                            <div className="flex items-center gap-1.5 text-sm text-gray-900">
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                              {collab.engagement_rate}%
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}