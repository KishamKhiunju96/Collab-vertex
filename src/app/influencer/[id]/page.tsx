"use client";

import InfluencerProfileView from "@/components/influencer/profile/InfluencerProfileView";
import { useParams } from "next/navigation";

export default function PublicInfluencerProfilePage() {
  const params = useParams();
  const influencerId = params.id as string;

  return <InfluencerProfileView influencerId={influencerId} />;
}
