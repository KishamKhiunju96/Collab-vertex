"use client";

import DashboardHeader from "@/components/influencer/dashboard/DashboardHeader";
import EventCards from "@/components/influencer/dashboard/EventCards";

export default function InfluencerDashboardPage() {
  return (
    <div className="p-6">
      <DashboardHeader/>


      <EventCards />
    </div>
  );
}
