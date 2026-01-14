"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axiosInstance";
import { clearToken } from "@/utils/authToken";
import { useUserData } from "@/api/hooks/useUserData";
import { useAuthProtection } from "@/api/hooks/useAuth";

type Status = "loading" | "authorized" | "unauthorized";

export default function BrandDashboardPage() {
  const { loading } = useAuthProtection();

  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const { user } = useUserData();

  useEffect(() => {
    const validateRole = async () => {
      try {
        const res = await api.get("/user/me");
        const role = res.data?.role;

        if (role !== "brand") {
          router.replace("/401");
          return;
        }

        setStatus("authorized");
      } catch (error) {
        clearToken();
        router.replace("/login");
      }
    };

    validateRole();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="text-lg text-gray-600">
          Loading Brand Dashboard...
        </span>
      </div>
    );
  }

  if (status !== "authorized") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="text-sm text-gray-500">Redirecting...</span>
      </div>
    );
  }

  return (
    <section className="space-y-6 p-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {loading
              ? "Hi.."
              : `Hi! ${user?.username}, Welcome to Collab Vertex`}
            x
          </h1>{" "}
          <p className="text-gray-500 mt-1">
            Manage events, collaborate with influencers, and track performance.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/brand/create")}
          className="px-4 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition"
        >
          + Create Brand
        </button>
      </header>

      {/*<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Active Events</p>
          <h2 className="text-xl font-bold mt-2">2</h2>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Influencers Collaborated</p>
          <h2 className="text-xl font-bold mt-2">15</h2>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Total Reach</p>
          <h2 className="text-xl font-bold mt-2">100</h2>
        </div>
      </div>*/}

      {/*<div className="border rounded-lg p-4">
        <h2 className="text-lg font-medium mb-3">Recent Activity</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✔ Event Tour created</li>
          <li>✔ Influencer Sushmita joined your event</li>
          <li>✔ Event Tour completed</li>
        </ul>
      </div>*/}
    </section>
  );
}
