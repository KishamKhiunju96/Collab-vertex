"use client";

import { useState } from "react";
import { useAuthProtection } from "@/api/hooks/useAuth";
import DashboardHeader from "./DashboardHeader";
import DashboardBody from "./DashboardBody";
import { useInfluencerProfile } from "@/api/hooks/useInfluencerProfile";
import InfluencerProfileModal from "../profile/InfluencerProfileModal";

export default function InfluencerDashboard() {
  const { loading, authenticated, role } = useAuthProtection();
  const { profile, onProfileCreated } = useInfluencerProfile();

  const [modalOpen, setModalOpen] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading Influencer Dashboard...
      </div>
    );
  }

  // Role protection
  if (!authenticated || role !== "influencer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER (Profile button navigates to route) */}
      <DashboardHeader />

      {/* MAIN BODY */}
      <DashboardBody
        profile={profile}
        onCreateClick={() => setModalOpen(true)}
      />

      {/* CREATE PROFILE MODAL */}
      <InfluencerProfileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(newProfile) => {
          onProfileCreated(newProfile);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
