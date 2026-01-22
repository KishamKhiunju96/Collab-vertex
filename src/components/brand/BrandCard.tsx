"use client";

import { Brand } from "@/api/services/brandService";

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  return (
    <div className="bg-white rounded-xl text-text-primary shadow-lg p-6 space-y-3">
      <h2 className="text-xl font-semibold">{brand.name}</h2>

      <p className="text-sm text-gray-600">
        <strong>Location:</strong> {brand.location}
      </p>

      {brand.description && (
        <p className="text-sm text-gray-600">
          <strong>Description:</strong> {brand.description}
        </p>
      )}

      {brand.website_url && (
        <p className="text-sm text-gray-600">
          <strong>Website:</strong>{" "}
          <a
            href={brand.website_url}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            {brand.website_url}
          </a>
        </p>
      )}

      <p className="text-xs text-gray-400">
        Created: {new Date(brand.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default BrandCard;
