import { useEffect, useState } from "react";
import {
  influencerService,
  CreateInfluencerPayload,
  InfluencerProfile,
} from "@/api/services/influencerService";
import { notify } from "@/utils/notify";
import { useUserData } from "@/api/hooks/useUserData";

export function useInfluencerProfile() {
  const { user, updateUser } = useUserData();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await influencerService.getProfile();
        setProfile(data);
      } catch (err) {
        console.log("No profile found", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const onProfileCreated = (
    newProfile: CreateInfluencerPayload | InfluencerProfile,
  ) => {
    if (newProfile.id) {
      setProfile(newProfile as InfluencerProfile);
      updateUser({ username: newProfile.name });
      notify.success("Profile created successfully!");
    }
  };

  return {
    profile,
    loading,
    onProfileCreated,
  };
}
