"use client";

import { useState } from "react";

export default function InfluencerProfilePage() {
  const [profile] = useState({
    name: "Name",
    email: "idc@example.com",
    location: "Kathmandu, Nepal",
  });

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="bg-background-light p-6 rounded-xl shadow space-y-4">
        <ProfileItem label="Name" value={profile.name} />
        <ProfileItem label="Email" value={profile.email} />
        <ProfileItem label="Location" value={profile.location} />
      </div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
