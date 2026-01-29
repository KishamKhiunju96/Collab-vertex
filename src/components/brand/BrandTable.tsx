"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { brandService } from "@/api/services/brandService";
import type { Brand } from "@/api/services/brandService";

interface BrandTableProps {
  refreshKey?: number;
  onBrandClick?: (brandId: string) => void;
}

const BrandTable: React.FC<BrandTableProps> = ({ refreshKey = 0, onBrandClick }) => {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await brandService.getBrands();
      setBrands(data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load brands.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands, refreshKey]);

  // ✅ SINGLE navigation logic (reused everywhere)
  const handleViewBrand = (brandId: string) => {
    if (onBrandClick) {
      onBrandClick(brandId);
    } else {
      router.push(`/dashboard/brand/${brandId}`);
    }
  };

  if (loading) return <p className="text-gray-600 text-center py-6">Loading brands…</p>;
  if (error) return <p className="text-red-600 text-center py-6">{error}</p>;
  if (!brands.length) return <p className="text-gray-600 text-center py-6">No brands found.</p>;

  return (
    <div className="border rounded-lg bg-white overflow-x-auto shadow">
      <table className="w-full text-sm min-w-[800px]">
        <thead className="bg-gray-100 text-text-primary">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Website</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id} className="border-t hover:bg-gray-50">
              {/* ✅ Brand name click */}
              <td
                className="p-3 font-medium text-blue-600 hover:underline cursor-pointer"
                onClick={() => handleViewBrand(brand.id)}
              >
                {brand.name}
              </td>

              <td className="p-3 text-text-primary">{brand.description || "—"}</td>
              <td className="p-3 text-text-primary">{brand.location || "—"}</td>

              <td className="p-3 text-text-primary">
                {brand.websiteUrl ? (
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {brand.websiteUrl}
                  </a>
                ) : (
                  "—"
                )}
              </td>

              {/* ✅ View icon (same logic) */}
              <td className="p-3 text-center">
                <Eye
                  className="h-4 w-4 inline-block cursor-pointer text-gray-600 hover:text-blue-600"
                  onClick={() => handleViewBrand(brand.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandTable;
