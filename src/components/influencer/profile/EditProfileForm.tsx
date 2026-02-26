import { useState } from "react";
import {
  User,
  MapPin,
  Target,
  Users,
  TrendingUp,
  FileText,
  X,
} from "lucide-react";
import { notify } from "@/utils/notify";
import {
  InfluencerProfile,
  influencerService,
  UpdateInfluencerPayload,
} from "@/api/services/influencerService";

interface EditProfileFormProps {
  profile: InfluencerProfile;
  onCancel: () => void;
  onSuccess: (profile: InfluencerProfile) => void;
}

export default function EditProfileForm({
  profile,
  onCancel,
  onSuccess,
}: EditProfileFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<UpdateInfluencerPayload>({
    name: profile.name,
    niche: profile.niche,
    audience_size: profile.audience_size,
    engagement_rate: profile.engagement_rate,
    bio: profile.bio,
    location: profile.location,
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.niche ||
      !formData.bio ||
      !formData.location
    ) {
      notify.error("Please fill in all required fields");
      return;
    }

    setIsUpdating(true);
    try {
      const updatedProfile = await influencerService.updateProfile(
        profile.id,
        formData,
      );
      notify.success("Profile updated successfully!");
      onSuccess(updatedProfile);
    } catch (error) {
      console.error("Update profile error:", error);
      notify.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden my-4 sm:my-8 animate-scaleIn hover:shadow-glow-lg transition-shadow duration-500">
        <div className="sticky top-0 bg-gradient-to-r from-button-primary-DEFAULT via-brand-primary-500 to-brand-primary-600 border-b border-button-primary-DEFAULT/20 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between z-10 overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">Edit Profile</h2>
            <p className="text-xs sm:text-sm text-brand-primary-100 mt-0.5 font-medium">Update your influencer information</p>
          </div>
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="relative z-10 p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50 text-white hover:rotate-90 transform"
            aria-label="Close"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleUpdateProfile} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-180px)] custom-scrollbar">
          {/* Full Name */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 transition-colors group-focus-within:text-button-primary-DEFAULT">
              <User size={16} className="sm:w-[18px] sm:h-[18px] text-button-primary-DEFAULT transition-transform group-hover:scale-110" />
              Full Name
              <span className="text-text-error animate-pulse">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-300 hover:border-button-primary-DEFAULT/50 text-text-primary placeholder:text-text-muted text-sm sm:text-base bg-white hover:shadow-md focus:shadow-lg"
                required
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-button-primary-DEFAULT/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Niche */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
              <Target size={16} className="sm:w-[18px] sm:h-[18px] text-brand-secondary-DEFAULT" />
              Niche
              <span className="text-text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.niche}
              onChange={(e) =>
                setFormData({ ...formData, niche: e.target.value })
              }
              placeholder="e.g., Fashion, Tech, Fitness, Travel"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-secondary-DEFAULT/20 focus:border-brand-secondary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
              required
            />
          </div>

          {/* Location */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
              <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-brand-accent-DEFAULT" />
              Location
              <span className="text-text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="City, Country"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-accent-DEFAULT/20 focus:border-brand-accent-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
              required
            />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="group">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
                <Users size={16} className="sm:w-[18px] sm:h-[18px] text-brand-highlight-DEFAULT" />
                Audience Size
                <span className="text-text-error">*</span>
              </label>
              <input
                type="number"
                value={formData.audience_size}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    audience_size: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Total followers"
                min="0"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-highlight-DEFAULT/20 focus:border-brand-highlight-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
                required
              />
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
                <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px] text-status-success" />
                Engagement Rate (%)
                <span className="text-text-error">*</span>
              </label>
              <input
                type="number"
                value={formData.engagement_rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    engagement_rate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.0"
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-status-success/20 focus:border-status-success outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
              <FileText size={16} className="sm:w-[18px] sm:h-[18px] text-brand-secondary-DEFAULT" />
              Bio
              <span className="text-text-error">*</span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell brands about yourself and what you do..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-secondary-DEFAULT/20 focus:border-brand-secondary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted resize-none text-sm sm:text-base"
              required
            />
            <p className="mt-1.5 text-xs text-text-muted">
              {(formData.bio || '').length} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border-subtle">
            <button
              type="button"
              onClick={onCancel}
              disabled={isUpdating}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-button-tertiary-border text-button-tertiary-text rounded-lg sm:rounded-xl hover:bg-button-tertiary-hover hover:border-button-primary-DEFAULT transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-button-primary-DEFAULT to-brand-primary-600 text-white rounded-lg sm:rounded-xl hover:from-button-primary-hover hover:to-brand-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
            >
              {isUpdating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
