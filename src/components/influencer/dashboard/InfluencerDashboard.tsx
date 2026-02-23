"use client";

import { useState } from "react";
import { useAuthProtection } from "@/api/hooks/useAuth";
import DashboardHeader from "./DashboardHeader";
import DashboardBody from "./DashboardBody";
import { useInfluencerProfile } from "@/api/hooks/useInfluencerProfile";
import InfluencerProfileModal from "../profile/InfluencerProfileModal";
import FloatingChatButton from "@/chat/components/FloatingChatButton";

export default function InfluencerDashboard() {
  const { loading, authenticated, role } = useAuthProtection();
  const { profile, onProfileCreated } = useInfluencerProfile();

  const [modalOpen, setModalOpen] = useState(false);

  // Mock chat contacts (replace with actual API call later)
  const [chatContacts] = useState([
    {
      id: "brand-1",
      username: "Nike Brand",
      email: "nike@example.com",
      role: "brand",
      lastMessage: "We have an exciting campaign for you!",
      unreadCount: 3,
      isOnline: true,
    },
    {
      id: "brand-2",
      username: "Adidas Marketing",
      email: "adidas@example.com",
      role: "brand",
      lastMessage: "Let's discuss collaboration details",
      unreadCount: 0,
      isOnline: false,
    },
  ]);

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

      {/* Floating Chat Button */}
      <FloatingChatButton
        contacts={chatContacts}
        isLoading={false}
        userRole="influencer"
        unreadTotal={chatContacts.reduce(
          (sum, contact) => sum + (contact.unreadCount || 0),
          0,
        )}
      />
    </div>
  );
}
