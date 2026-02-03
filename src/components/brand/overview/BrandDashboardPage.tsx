"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { brandService, Brand } from "@/api/services/brandService";
import CreateBrandForm from "@/components/brand/CreateBrandForm";
import { useUserData } from "@/api/hooks/useUserData";

import Modal from "@/components/ui/Modal";
import { notify } from "@/utils/notify";
import { ActivityFeed } from "@/components/brand/overview/ActivityFeed";
import { brandActivities } from "@/data/brandactivities";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";

export default function BrandDashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { user, loading: userLoading } = useUserData();

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Fetch brands created by this user
      const fetchedBrands = await brandService.getBrands(); // GET /brand/brandsbyuser
      setBrands(fetchedBrands);
    } catch (err) {
      console.error(err);
      setError("Failed to load brands.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch brands automatically when user is loaded and authorized
  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      notify.error("Unauthorized");
      return;
    }

    if (user.role !== "brand") {
      notify.error("Access denied");
      return;
    }

    fetchBrands();
  }, [userLoading, user, fetchBrands]);

  const handleCreateSuccess = async () => {
    setIsCreateOpen(false);
    await fetchBrands(); // ✅ Refresh brand list after creating a new brand
    notify.success("Brand profile created successfully!");
  };

  const handleDelete = async (brandId: string) => {
    const confirmed = confirm("Are you sure you want to delete this brand?");
    if (!confirmed) return;

    try {
      await brandService.deleteBrand(brandId);
      setBrands((prev) => prev.filter((b) => b.id !== brandId));
      notify.success("Brand deleted successfully");
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete brand");
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Failed to load user data
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 text-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Hi {user.username}, Welcome to Collab Vertex
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your brands, collaborate with influencers, and track performance.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition z-50"
        >
          + Create Brand
        </button>
      </div>

      {/* Empty state */}
      {!loading && brands.length === 0 && (
        <div className="text-gray-500 text-center py-10">
          No brand profile found. Click <b>+ Create Brand</b> to get started.
        </div>
      )}

      {/* Brand Table */}
      {brands.length > 0 && (
        <div className="bg-white rounded border border-gray-300 overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Location</th>
                <th className="px-4 py-2 border-b">Website</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    <Link
                      href={`/dashboard/brand/${brand.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {brand.name}
                    </Link>
                  </td>

                  <td className="px-4 py-2 border-b">{brand.location}</td>

                  <td className="px-4 py-2 border-b">{brand.websiteUrl ?? "-"}</td>

                  <td className="px-4 py-2 border-b">
                    <div className="flex justify-center gap-3">
                      <Link href={`/dashboard/brand/${brand.id}`} title="View">
                        <Eye size={18} />
                      </Link>

                      <Link
                        href={`/dashboard/brand/${brand.id}/edit`}
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() => handleDelete(brand.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Analytics & Activity - ALWAYS VISIBLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-300 rounded p-4">
          <AnalyticsChart />
        </div>

        <ActivityFeed activities={brandActivities} />
      </div>

      {/* Create Brand Modal */}
      <Modal
        open={isCreateOpen}
        title="Create New Brand"
        size="lg"
        onClose={() => setIsCreateOpen(false)}
      >
        <CreateBrandForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
    </div>
  );
}
