"use client";

import { useEffect, useState } from "react";
import { notify } from "@/utils/notify";
import {
  InfluencerProfile,
  influencerService,
} from "@/api/services/influencerService";
import EmptyProfileState from "./EmptyProfileState";
import CreateProfileForm from "./CreateProfileForm";
import ProfileView from "./ProfileView";

export default function ProfileDetails() {
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await influencerService.getProfileByUser();
        if (data) {
          setProfile(data as InfluencerProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        // 404 means no profile exists yet, which is fine
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) {
          setProfile(null);
        } else {
          notify.error("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileCreated = (newProfile: InfluencerProfile) => {
    setProfile(newProfile);
    setShowCreateForm(false);
  };

  const handleProfileUpdated = (updatedProfile: InfluencerProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile && !showCreateForm) {
    return <EmptyProfileState onCreateClick={() => setShowCreateForm(true)} />;
  }

  if (showCreateForm && !profile) {
    return (
      <CreateProfileForm
        onCancel={() => setShowCreateForm(false)}
        onSuccess={handleProfileCreated}
      />
    );
  }

  if (!profile) return null;

  return <ProfileView profile={profile} onProfileUpdate={handleProfileUpdated} />;
}