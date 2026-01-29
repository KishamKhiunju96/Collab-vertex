"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Eye } from "lucide-react";

import { brandService } from "@/api/services/brandService";
import type { Brand } from "@/types/brand";

interface BrandTableProps {
  refreshKey: number;
  onRefresh?: () => void;
}

const BrandTable: React.FC<BrandTableProps> = ({
  refreshKey,
  onRefresh,
}) => {
  const router = useRouter();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editBrand, setEditBrand] = useState<Brand | null>(null);


  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await brandService.getBrands();
      setBrands(data);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
      setError("Failed to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands, refreshKey]);


  const handleViewBrand = (brandId: string) => {
    router.push(`/dashboard/brand/${brandId}`);
  };

  const handleDeleteBrand = async (brandId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this brand? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(brandId);
      await brandService.deleteBrand(brandId);

      setBrands((prev) => prev.filter((b) => b.id !== brandId));
      onRefresh?.();
    } catch (err) {
      console.error("Delete brand failed:", err);
      alert("Failed to delete brand. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-text-primary">
        Loading brands…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <p className="text-sm text-text-primary">
          No brands created yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-background-light text-text-primary">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Website</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand) => (
              <tr
                key={brand.id}
                className="border-t hover:bg-gray-50"
              >
                {/* Name */}
                <td
                  className="p-3 font-medium cursor-pointer text-black hover:underline"
                  onClick={() => handleViewBrand(brand.id)}
                >
                  {brand.name}
                </td>

                {/* Description */}
                <td className="p-3 text-text-primary">
                  {brand.description || "—"}
                </td>

                {/* Location */}
                <td className="p-3 text-text-primary">
                  {brand.location || "—"}
                </td>

                {/* Website */}
                <td className="p-3 text-text-primary">
                  {brand.websiteUrl ? (
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600"
                    >
                      {brand.websiteUrl}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleViewBrand(brand.id)}
                    title="View brand"
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => setEditBrand(brand)}
                    title="Edit brand"
                    className="p-2 rounded-md text-green-600 hover:bg-green-50"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    disabled={deletingId === brand.id}
                    title="Delete brand"
                    className={`p-2 rounded-md ${
                      deletingId === brand.id
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Edit {editBrand.name}
            </h2>

            <p className="text-sm text-gray-600">
              Connect this modal to{" "}
              <code>brandService.updateBrand()</code>.
            </p>

            <button
              onClick={() => setEditBrand(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandTable;
