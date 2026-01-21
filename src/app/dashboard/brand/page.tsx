"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axiosInstance";
import { useUserData } from "@/api/hooks/useUserData";
import BrandTable from "@/components/brand/BrandTable";
import CreateBrandForm from "@/components/dashboard/CreateBrandForm";
import { clearToken } from "@/utils/3.";

type Status = "loading" | "authorized" | "unauthorized";

export default function BrandDashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUserData();
  const [status, setStatus] = useState<Status>("loading");

  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Validate role
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
            {userLoading
              ? "Hi..."
              : `Hi! ${user?.username}, Welcome to Collab Vertex`}
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your brands, collaborate with influencers, and track
            performance.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition"
        >
          + Create Brand
        </button>
      </header>

      <BrandTable refreshKey={refreshKey} />

      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-[420px] shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
          >
            <CreateBrandForm
              onSuccess={() => {
                setRefreshKey((prev) => prev + 1);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
