"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ReactNode } from "react";

export default function InfluencerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
