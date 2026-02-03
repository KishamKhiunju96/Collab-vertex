import React from "react";
import InfluencerProfileForm from "./InfluencerProfileForm";
import { CreateInfluencerPayload } from "@/api/services/influencerService";

interface InfluencerProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newProfile: CreateInfluencerPayload) => void;
}

const InfluencerProfileModal: React.FC<InfluencerProfileModalProps> = ({ open, onClose, onSubmit }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold mb-4 text-text-primary">Create Influencer Profile</h3>

        {/* Form */}
        <InfluencerProfileForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default InfluencerProfileModal;
