"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { brandService, Brand } from "@/api/services/brandService";
import CreateBrandForm from "@/components/brand/CreateBrandForm";
import { useUserData } from "@/api/hooks/useUserData";

import Modal from "@/components/ui/Modal";
import { notify } from "@/utils/notify";
import { ActivityFeed } from "@/components/brand/ActivityFeed";
import { brandActivities } from "@/data/brandactivities";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";

export default function BrandDashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // ✅ Proper user hook usage
  const { user, loading: userLoading } = useUserData();

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedBrands = await brandService.getBrands();
      setBrands(fetchedBrands);
    } catch (err) {
      console.error(err);
      setError("Failed to load brands.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    fetchBrands();
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

  // 🔒 Handle user loading first
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

  if (loading) return <p>Loading brands...</p>;
  if (error) return <p>{error}</p>;
  if (brands.length === 0) return <p>No brands found.</p>;

  return (
  <div className="p-6 space-y-8 text-black">
    <div className="flex justify-between items-center">
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
        onClick={() => setIsCreateOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        + Create Brand
      </button>
    </div>

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

              <td className="px-4 py-2 border-b">
                {brand.websiteUrl ? (
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {brand.websiteUrl}
                  </a>
                ) : (
                  "-"
                )}
              </td>

              <td className="px-4 py-2 border-b">
                <div className="flex justify-center gap-3">
                  <Link
                    href={`/dashboard/brand/${brand.id}`}
                    title="View"
                    className="text-blue-600"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    href={`/dashboard/brand/${brand.id}/edit`}
                    title="Edit"
                    className="text-green-600"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(brand.id)}
                    title="Delete"
                    className="text-red-600"
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

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-gray-300 rounded p-4">
        <AnalyticsChart />
      </div>

      <div>
        <ActivityFeed activities={brandActivities} />
      </div>
    </div>

    <Modal
      open={isCreateOpen}
      onClose={() => setIsCreateOpen(false)}
      title="Create New Brand"
    >
      <CreateBrandForm
        onSuccess={handleCreateSuccess}
        onCancel={() => setIsCreateOpen(false)}
      />
    </Modal>
  </div>
);

}
