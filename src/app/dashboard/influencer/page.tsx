"use client";

import { useState, useEffect } from "react";
import { influencerService, CreateInfluencerPayload } from "@/api/services/influencerService";
import { notify } from "@/utils/notify";
import { useAuthProtection } from "@/api/hooks/useAuth";
import { useUserData } from "@/api/hooks/useUserData";
import Link from "next/link";
import { authService } from "@/api/services/authService";
import InfluencerProfileModal from "@/components/influencer/InfluencerProfileModal";

export default function InfluencerDashboardPage() {
  const { loading, authenticated, role } = useAuthProtection();
  const { user, setUser } = useUserData(); // to update username after profile creation
  const [open, setOpen] = useState(false); // profile dropdown
  const [modalOpen, setModalOpen] = useState(false); // modal popup
  const [profile, setProfile] = useState<CreateInfluencerPayload | null>(null); // influencer profile

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await influencerService.getProfileByUser(); // GET /influencer/get_influencer_by_user
        if (data && data.id) setProfile(data);
      } catch (err) {
        console.log("No profile found", err);
      }
    };
    fetchProfile();
  }, []);

  // Called after creating profile
  const handleProfileCreated = (newProfile: CreateInfluencerPayload) => {
    setProfile(newProfile);
    if (setUser) setUser({ ...user, username: newProfile.name }); // update username in header
    setModalOpen(false);
    notify.success("Profile created successfully!");
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading Influencer Dashboard...</div>;
  if (!authenticated || role !== "influencer") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-b-2xl">
        <h1 className="text-2xl font-bold text-gray-900">
          Hi! {user?.username || "Influencer"}, Welcome to Collab Vertex 👋
        </h1>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search brands"
            className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="px-4 py-2 border text-text-primary rounded-lg hover:bg-green-500 hover:text-white transition"
            >
              Profile
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                <Link
                  href="/influencer-dashboard/profile"
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-green-100"
                  onClick={() => setOpen(false)}
                >
                  My Profile
                </Link>

                <button
                  onClick={authService.logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="flex flex-col items-center justify-center mt-20 space-y-6">
        {!profile ? (
          <>
            <h2 className="text-xl font-semibold text-gray-700">
              Continue with creating your Influencer Profile
            </h2>

            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Create Profile
            </button>
          </>
        ) : (
          <h2 className="text-xl font-semibold text-gray-700">
            Your profile is ready! Welcome, {profile.name} 👏
          </h2>
        )}
      </main>

      {/* Profile Creation Modal */}
      <InfluencerProfileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProfileCreated} // returns created profile
      />
    </div>
  );
}
