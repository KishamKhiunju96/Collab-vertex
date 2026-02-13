"use client";

import { useState } from "react";
import { Search, X, MapPin, Users, TrendingUp, Mail } from "lucide-react";
import {
  influencerService,
  InfluencerProfile,
} from "@/api/services/influencerService";
import { notify } from "@/utils/notify";

export default function InfluencerSearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<InfluencerProfile[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<InfluencerProfile | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      notify.error("Please enter an influencer name to search");
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      const result = await influencerService.searchByName(searchQuery.trim());
      // Wrap single result in array for display
      setSearchResults([result]);
      notify.success("Influencer found!");
    } catch (error) {
      console.error("Search error:", error);
      notify.error("Influencer not found. Please try a different name.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setSelectedInfluencer(null);
  };

  const handleViewDetails = (influencer: InfluencerProfile) => {
    setSelectedInfluencer(influencer);
  };

  const handleCloseDetails = () => {
    setSelectedInfluencer(null);
  };

  return (
    <div className="w-full">
      {/* Search Box */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Search Influencers
        </h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative text-text-primary">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter influencer name..."
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isSearching}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <Search size={20} />
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Search Results{" "}
              {searchResults.length > 0 && `(${searchResults.length})`}
            </h3>
            {searchResults.length > 0 && (
              <button
                onClick={handleClearSearch}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Results
              </button>
            )}
          </div>

          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">No influencers found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try searching with a different name
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((influencer) => (
                <div
                  key={influencer.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                  onClick={() => handleViewDetails(influencer)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-800 truncate">
                        {influencer.name}
                      </h4>
                      <p className="text-sm text-blue-600 font-medium">
                        {influencer.niche}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="truncate">{influencer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span>
                        {influencer.audience_size.toLocaleString()} followers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-gray-400" />
                      <span>{influencer.engagement_rate}% engagement</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Influencer Details Modal */}
      {selectedInfluencer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                Influencer Details
              </h3>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div>
                <h4 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedInfluencer.name}
                </h4>
                <p className="text-lg text-blue-600 font-medium mb-1">
                  {selectedInfluencer.niche}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={20} className="text-blue-600" />
                    <span className="text-sm text-gray-600">Audience Size</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {selectedInfluencer.audience_size.toLocaleString()}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={20} className="text-green-600" />
                    <span className="text-sm text-gray-600">
                      Engagement Rate
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {selectedInfluencer.engagement_rate}%
                  </p>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={20} className="text-gray-400" />
                  <h5 className="font-semibold text-gray-700">Location</h5>
                </div>
                <p className="text-gray-600 ml-7">
                  {selectedInfluencer.location}
                </p>
              </div>

              {/* Bio */}
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">Bio</h5>
                <p className="text-gray-600 leading-relaxed">
                  {selectedInfluencer.bio}
                </p>
              </div>

              {/* Timestamps */}
              <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
                <p>
                  <span className="font-medium">Profile Created:</span>{" "}
                  {new Date(selectedInfluencer.created_at).toLocaleDateString()}
                </p>
                <p className="mt-1">
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(selectedInfluencer.updated_at).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2">
                  <Mail size={20} />
                  Contact Influencer
                </button>
                <button
                  onClick={handleCloseDetails}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
