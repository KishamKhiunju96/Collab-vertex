"use client";

import type { Brand } from "@/api/services/brandService";

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  return (
    <div className="bg-white rounded-xl text-text-primary shadow-lg p-6 space-y-3">
      <h2 className="text-xl font-semibold">{brand.name}</h2>

      <p className="text-sm text-text-primary">
        <strong>Location:</strong> {brand.location}
      </p>

      {brand.description && (
        <p className="text-sm text-text-primary">
          <strong>Description:</strong> {brand.description}
        </p>
      )}

      {brand.websiteUrl && (
        <p className="text-sm text-text-primary">
          <strong>Website:</strong>{" "}
          <a
            href={brand.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {brand.websiteUrl}
          </a>
        </p>
      )}

      <p className="text-xs text-gray-400">
        Created: {new Date(brand.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default BrandCard;
