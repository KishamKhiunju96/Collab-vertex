import { useEffect, useState } from "react";
import { influencerService, CreateInfluencerPayload } from "@/api/services/influencerService";
import { notify } from "@/utils/notify";
import { useUserData } from "@/api/hooks/useUserData";

export function useInfluencerProfile() {
  const { user, setUser } = useUserData();
  const [profile, setProfile] = useState<CreateInfluencerPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await influencerService.getProfileByUser();
        if (data?.id) setProfile(data);
      } catch {
        console.log("No profile found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const onProfileCreated = (newProfile: CreateInfluencerPayload) => {
    setProfile(newProfile);
    setUser?.({ ...user, username: newProfile.name });
    notify.success("Profile created successfully!");
  };

  return {
    profile,
    loading,
    onProfileCreated,
  };
}
