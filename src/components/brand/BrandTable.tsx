"use client";
import { useEffect, useState } from "react";
import { Brand, getBrands, deleteBrand } from "@/api/services/brandService";
import { Trash2, Edit, Eye } from "lucide-react";

interface BrandTableProps {
  refreshKey: number;
  onRefresh?: () => void;
}

const BrandTable: React.FC<BrandTableProps> = ({ refreshKey, onRefresh }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // For modal handling
  const [viewBrand, setViewBrand] = useState<Brand | null>(null);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBrands();
      setBrands(data);
    } catch (err: unknown) {
      console.error("Failed to fetch brands", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch brands. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [refreshKey]);

  const handleDelete = async (brandId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this brand? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeletingId(brandId);
      await deleteBrand(brandId);
      setBrands((prev) => prev.filter((b) => b.id !== brandId));
      onRefresh?.();
      alert("Brand deleted successfully");
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete brand. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId) || null;
    setViewBrand(brand);
  };

  const handleEdit = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId) || null;
    setEditBrand(brand);
  };

  const closeModal = () => {
    setViewBrand(null);
    setEditBrand(null);
  };

  if (loading)
    return <p className="text-sm text-text-primary">Loading brands...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (brands.length === 0)
    return <p className="text-sm text-text-primary">No brands created yet.</p>;

  return (
    <>
      <div className="border rounded-lg text-text-primary bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-100 text-text-primary">
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
              <tr key={brand.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium text-text-primary">
                  {brand.name}
                </td>
                <td className="p-3 text-text-primary">
                  {brand.description || "—"}
                </td>
                <td className="p-3 text-text-primary">
                  {brand.location || "—"}
                </td>
                <td className="p-3 text-blue-600">
                  {brand.website_url ? (
                    <a
                      href={brand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {brand.website_url}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleView(brand.id)}
                    title="View brand"
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors"
                  >
                    <Eye size={18} strokeWidth={2} />
                  </button>

                  <button
                    onClick={() => handleEdit(brand.id)}
                    title="Edit brand"
                    className="p-2 rounded-md text-green-600 hover:bg-green-50 hover:text-green-700 active:bg-green-100 transition-colors"
                  >
                    <Edit size={18} strokeWidth={2} />
                  </button>

                  <button
                    onClick={() => handleDelete(brand.id)}
                    disabled={deletingId === brand.id}
                    title="Delete brand"
                    className={`
                      p-2 rounded-md transition-colors
                      ${
                        deletingId === brand.id
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100"
                      }
                    `}
                  >
                    <Trash2 size={18} strokeWidth={2} />
                    {deletingId === brand.id && (
                      <span className="ml-2 text-xs text-gray-500">
                        Deleting...
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background-light text-text-primary p-6 rounded-lg w-96 max-w-full relative">
            <h2 className="text-lg font-semibold mb-4">{viewBrand.name}</h2>
            <p>
              <strong>Description:</strong> {viewBrand.description || "—"}
            </p>
            <p>
              <strong>Location:</strong> {viewBrand.location || "—"}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              {viewBrand.website_url ? (
                <a
                  href={viewBrand.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {viewBrand.website_url}
                </a>
              ) : (
                "—"
              )}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background-light text-text-primary p-6 rounded-lg w-96 max-w-full relative">
            <h2 className="text-lg font-semibold mb-4">
              Edit {editBrand.name}
            </h2>
            <p>Here you can put a form to edit brand details.</p>
            <button
              onClick={closeModal}
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
