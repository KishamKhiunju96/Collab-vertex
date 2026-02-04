"use client";
import { useUserData } from "@/api/hooks/useUserData";
import BrandDashboardPage from "@/components/brand/overview/BrandDashboardPage";
import InfluencerDashboard from "@/components/influencer/dashboard/InfluencerDashboard";


export default function Page() {
  const { user }= useUserData();
  console.log(user)

  switch (user?.role) {
    case "brand":
      return <BrandDashboardPage />;
    case "influencer":
      return <InfluencerDashboard/>;
    default:
      break;
  }
  return <div>Unauthorized</div>;
}
