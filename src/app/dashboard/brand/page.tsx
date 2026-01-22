"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUserData } from "@/api/hooks/useUserData";
import BrandTable from "@/components/brand/BrandTable";
import CreateBrandForm from "@/components/dashboard/CreateBrandForm";
import { clearToken } from "@/utils/auth";

export default function BrandDashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading, error } = useUserData();

  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (userLoading) return;

    if (error || !user) {
      clearToken();
      router.replace("/login");
      return;
    }

    if (user.role !== "brand") {
      router.replace("/401");
    }
  }, [user, userLoading, error, router]);

  if (userLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="text-lg text-gray-600">
          Loading Brand Dashboard...
        </span>
      </div>
    );
  }

  if (!user || user.role !== "brand") {
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
            Hi {user.username}, Welcome to Collab Vertex
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
            onClick={(e) => e.stopPropagation()}
          >
            <CreateBrandForm
              onSuccess={() => {
                setRefreshKey((prev) => prev + 1);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
