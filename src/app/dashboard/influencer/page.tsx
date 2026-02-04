"use client";

import DashboardHeader from "@/components/influencer/dashboard/DashboardHeader";
import EventCards from "@/components/influencer/dashboard/EventCards";

export default function InfluencerDashboardPage() {
  return (
    <div className="p-6">
      <DashboardHeader/>
      <h1 className="text-2xl text-text-primary mt-14 font-semibold mb-6">
        Available Events
      </h1>

      <EventCards />
    </div>
  );
}
