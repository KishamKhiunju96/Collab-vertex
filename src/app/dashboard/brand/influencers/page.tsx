"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import InfluencerSearchBox from "@/components/brand/InfluencerSearchBox";

export default function FindInfluencersPage() {
  const { loading, authenticated, role } = useAuthProtection();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <span className="text-lg text-gray-600 font-medium">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // Role protection
  if (!authenticated || role !== "brand") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Access denied. Brand accounts only.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Find Influencers
          </h1>
          <p className="text-gray-600 mt-2">
            Search and connect with influencers for your brand collaborations
          </p>
        </div>

        {/* Search Component */}
        <InfluencerSearchBox />
      </div>
    </div>
  );
}
