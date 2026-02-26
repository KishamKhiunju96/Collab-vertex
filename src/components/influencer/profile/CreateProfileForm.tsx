import { useState } from "react";
import {
  User,
  MapPin,
  Target,
  Users,
  TrendingUp,
  FileText,
} from "lucide-react";
import { notify } from "@/utils/notify";
import {
  InfluencerProfile,
  influencerService,
  CreateInfluencerPayload,
} from "@/api/services/influencerService";

interface CreateProfileFormProps {
  onCancel: () => void;
  onSuccess: (profile: InfluencerProfile) => void;
}

export default function CreateProfileForm({
  onCancel,
  onSuccess,
}: CreateProfileFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateInfluencerPayload>({
    name: "",
    niche: "",
    audience_size: 0,
    engagement_rate: 0,
    bio: "",
    location: "",
  });

  const handleCreateProfile = async (e: React.FormEvent) => {
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

    setIsCreating(true);
    try {
      const newProfile = await influencerService.createProfile(formData);
      notify.success("Profile created successfully!");
      onSuccess(newProfile as InfluencerProfile);
    } catch (error) {
      console.error("Create profile error:", error);
      notify.error("Failed to create profile. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8 bg-gradient-to-br from-background-hero via-white to-background-alternate">
      <div className="w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-border-subtle overflow-hidden animate-fade-in-up hover:shadow-glow-lg transition-shadow duration-500">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-button-primary-DEFAULT via-brand-primary-500 to-brand-primary-600 px-4 sm:px-8 py-4 sm:py-6 relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
              Create Your Influencer Profile
            </h2>
            <p className="text-xs sm:text-sm text-brand-primary-100 font-medium">
              Fill in your details to start your journey with brands
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateProfile} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          {/* Full Name */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5 transition-colors group-focus-within:text-button-primary-DEFAULT">
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
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5 transition-colors group-focus-within:text-brand-secondary-DEFAULT">
              <Target size={16} className="sm:w-[18px] sm:h-[18px] text-brand-secondary-DEFAULT transition-transform group-hover:scale-110" />
              Niche
              <span className="text-text-error animate-pulse">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.niche}
                onChange={(e) =>
                  setFormData({ ...formData, niche: e.target.value })
                }
                placeholder="e.g., Fashion, Tech, Fitness, Travel"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-secondary-DEFAULT/20 focus:border-brand-secondary-DEFAULT outline-none transition-all duration-300 hover:border-brand-secondary-DEFAULT/50 text-text-primary placeholder:text-text-muted text-sm sm:text-base bg-white hover:shadow-md focus:shadow-lg"
                required
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-brand-secondary-DEFAULT/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            <p className="mt-1.5 text-xs text-text-muted transition-colors group-focus-within:text-brand-secondary-DEFAULT/70">
              Your primary area of expertise or content focus
            </p>
          </div>

          {/* Location */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5 transition-colors group-focus-within:text-brand-accent-DEFAULT">
              <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-brand-accent-DEFAULT transition-transform group-hover:scale-110" />
              Location
              <span className="text-text-error animate-pulse">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, Country"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-accent-DEFAULT/20 focus:border-brand-accent-DEFAULT outline-none transition-all duration-300 hover:border-brand-accent-DEFAULT/50 text-text-primary placeholder:text-text-muted text-sm sm:text-base bg-white hover:shadow-md focus:shadow-lg"
                required
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-brand-accent-DEFAULT/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="group">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5">
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
              <p className="mt-1.5 text-xs text-text-muted">
                Total followers across all platforms
              </p>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5">
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
              <p className="mt-1.5 text-xs text-text-muted">
                Average engagement percentage
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5 transition-colors group-focus-within:text-brand-secondary-DEFAULT">
              <FileText size={16} className="sm:w-[18px] sm:h-[18px] text-brand-secondary-DEFAULT transition-transform group-hover:scale-110" />
              Bio
              <span className="text-text-error animate-pulse">*</span>
            </label>
            <div className="relative">
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell brands about yourself, your content style, and what makes you unique..."
                rows={5}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-secondary-DEFAULT/20 focus:border-brand-secondary-DEFAULT outline-none transition-all duration-300 hover:border-brand-secondary-DEFAULT/50 text-text-primary placeholder:text-text-muted resize-none text-sm sm:text-base bg-white hover:shadow-md focus:shadow-lg"
                required
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand-secondary-DEFAULT/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            <p className="mt-1.5 text-xs text-text-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 transition-colors group-focus-within:text-brand-secondary-DEFAULT/70">
              <span>Share your story and what you bring to collaborations</span>
              <span className={`font-medium transition-colors ${formData.bio.length > 0 ? 'text-brand-secondary-DEFAULT' : 'text-text-disabled'}`}>{formData.bio.length} characters</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border-subtle">
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-button-primary-DEFAULT via-brand-primary-500 to-brand-primary-600 text-white rounded-lg sm:rounded-xl hover:from-button-primary-hover hover:via-brand-primary-600 hover:to-brand-primary-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base relative overflow-hidden group"
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              {isCreating ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
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
                  <span className="font-semibold">Creating Profile...</span>
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <User size={18} className="group-hover:scale-110 transition-transform" />
                  Create Profile
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isCreating}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-button-tertiary-border text-button-tertiary-text rounded-lg sm:rounded-xl hover:bg-button-tertiary-hover hover:border-button-primary-DEFAULT transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base hover:shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
