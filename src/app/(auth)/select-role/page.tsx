"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthContainer from "@/components/auth/AuthContainer";
import RoleCard from "./components/RoleCard";

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<"Brand" | "Influencer" | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (!selectedRole) return;
    
    const normalizedRole = selectedRole.toLowerCase();
    localStorage.setItem("pendingUserRole", normalizedRole);
    router.push("/register");
  };

  return (
    <AuthContainer>
      <div className="w-full py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Join Collab-vertex
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Choose how you want to collaborate. Connect with brands or influencers and grow together.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          <RoleCard
            role="Brand"
            title="I'm a Brand"
            description="Create campaigns and find influencers to promote your brand."
            imageUrl="/images/Branding2.jpg"
            buttonText="Choose Brand"
            accentColor="blue"
            selected={selectedRole === "Brand"}
            onClick={() => setSelectedRole("Brand")}
          />

          <RoleCard
            role="Influencer"
            title="I'm an Influencer"
            description="Discover collaboration opportunities and grow your audience."
            imageUrl="/images/Influencer1.jpg"
            buttonText="Choose Influencer"
            accentColor="green"
            selected={selectedRole === "Influencer"}
            onClick={() => setSelectedRole("Influencer")}
          />
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="
              px-8 py-3 rounded-lg font-medium text-white
              bg-indigo-600 hover:bg-indigo-700
              disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {selectedRole ? `Continue as ${selectedRole}` : "Select a Role"}
          </button>

          {selectedRole && (
            <p className="mt-3 text-sm text-green-600">
              {selectedRole} selected
            </p>
          )}

          <p className="mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthContainer>
  );
}