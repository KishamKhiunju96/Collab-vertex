"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleCard from "./components/RoleCard";

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<
    "Brand" | "Influencer" | null
  >(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedRole) {
      // Save the selected role for future use (e.g., dashboard, profile)
      localStorage.setItem("userRole", selectedRole);
      localStorage.setItem("collabVertexOnboarded", "true");

      // Redirect to dashboard or home page
      router.push("/dashboard"); // Change this to your actual next route
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl w-full">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Collab-vertex
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Choose how you want to collaborate on Collab-vertex
          </p>
          <p className="text-lg text-gray-600 mt-4">
            Connect, create events, and grow together.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <RoleCard
            role="Brand"
            title="I'm a Brand"
            description="Create exciting campaigns and events. Find the perfect influencers to promote your brand."
            imageUrl="/images/Branding2.jpg"
            buttonText="Choose Brand"
            accentColor="purple"
            selected={selectedRole === "Brand"}
            onClick={() => setSelectedRole("Brand")}
          />

          <RoleCard
            role="Influencer"
            title="I'm an Influencer"
            description="Discover brand collaboration opportunities and paid events. Grow your audience and earnings."
            imageUrl="/images/Influencer1.jpg"
            buttonText="Choose Influencer"
            accentColor="emerald"
            selected={selectedRole === "Influencer"}
            onClick={() => setSelectedRole("Influencer")}
          />
        </div>

        {/* Continue Button */}
        <div className="text-center mt-16">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-10 py-4 rounded-full text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              selectedRole === "Brand"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                : selectedRole === "Influencer"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  : "bg-gray-300"
            }`}
          >
            Continue as {selectedRole || "Selected Role"} →
          </button>

          {!selectedRole && (
            <p className="mt-4 text-gray-500">
              Please select a role to continue
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
