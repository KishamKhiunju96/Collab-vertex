"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Brand } from "@/api/services/brandService";
import UpdateBrandForm from "./UpdateBrandForm";

interface BrandViewModalProps {
  open: boolean;
  brand: Brand | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onUpdated: (updatedBrand: Brand) => void;
}

const BrandViewModal: React.FC<BrandViewModalProps> = ({
  open,
  brand,
  loading = false,
  error = null,
  onClose,
  onUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (loading || !brand) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 border border-gray-200 text-center">
          <span className="text-lg text-gray-700">
            {loading ? "Loading brand details..." : "Brand not found"}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 border border-gray-200 text-center">
          <span className="text-lg text-red-600">{error}</span>
          <button
            onClick={onClose}
            className="block mt-6 px-5 py-2.5 border border-gray-300 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!isEditing ? (
          <>
            <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-5 pr-10">
              {brand.name}
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Description:
                </span>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {brand.description || "—"}
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Location:
                </span>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {brand.location || "—"}
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Website:
                </span>
                {brand.websiteUrl ? (
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {brand.websiteUrl}
                  </a>
                ) : (
                  <p className="mt-1 text-gray-600 dark:text-gray-400">—</p>
                )}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                Created: {new Date(brand.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Edit Brand
              </button>
            </div>
          </>
        ) : (
          <UpdateBrandForm
            brand={brand}
            onUpdate={(updatedBrand) => {
              onUpdated(updatedBrand);
              setIsEditing(false);
              onClose();
            }}
            onClose={() => setIsEditing(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BrandViewModal;
