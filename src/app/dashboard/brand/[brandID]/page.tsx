"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Globe } from "lucide-react";
import { brandService, Brand } from "@/api/services/brandService";

export default function BrandDetailPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = Array.isArray(params.brandID)
    ? params.brandID[0]
    : params.brandID;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrand = useCallback(async () => {
    if (!brandId) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedBrand = await brandService.getBrandById(brandId);
      setBrand(fetchedBrand);
    } catch (err) {
      console.error(err);
      setError("Failed to load brand details.");
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  /* -----------------------------
     Loading State
  ------------------------------ */
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  /* -----------------------------
     Error State
  ------------------------------ */
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchBrand}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-600">
        Brand not found.
      </div>
    );
  }

  /* -----------------------------
     Main UI
  ------------------------------ */
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-text-primary">
          {brand.name}
        </h1>
      </div>

      {/* Brand Info Card */}
      <div className="bg-white rounded-lg shadow border p-6 space-y-4">
        {brand.description && (
          <p className="text-gray-700 leading-relaxed">
            {brand.description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-text-primary">
              {brand.location || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Website</p>
            {brand.websiteUrl ? (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Globe className="h-4 w-4" />
                {brand.websiteUrl}
              </a>
            ) : (
              <p className="text-text-primary">—</p>
            )}
          </div>
        </div>
      </div>

      {/* Future Sections Placeholder */}
      {/* 
        - Events under this brand
        - Analytics
        - Edit/Delete actions
        - Activity logs
      */}
    </div>
  );
}
