import { useState } from "react";
import {
  User,
  MapPin,
  Target,
  Users,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
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
  const [currentStep, setCurrentStep] = useState(1);
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

  const isStep1Valid = formData.name && formData.niche && formData.location;
  const isStep2Valid =
    formData.audience_size > 0 &&
    formData.engagement_rate > 0 &&
    formData.bio.length > 0;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getEngagementColor = (rate: number): string => {
    if (rate >= 5) return "text-green-600";
    if (rate >= 3) return "text-emerald-500";
    if (rate >= 1) return "text-yellow-500";
    return "text-gray-400";
  };

  const getEngagementLabel = (rate: number): string => {
    if (rate >= 5) return "Excellent";
    if (rate >= 3) return "Good";
    if (rate >= 1) return "Average";
    if (rate > 0) return "Low";
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10 bg-gradient-to-br from-rose-50 via-white to-orange-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-100 to-orange-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-50 to-rose-50 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-gray-200/50 border border-white overflow-hidden">
          {/* Header */}
          <div className="relative px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500">
            {/* Header pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/30 hover:text-white transition-all duration-200"
            >
              <X size={16} />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Create Your Profile
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 font-medium">
                    Start connecting with brands today
                  </p>
                </div>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mt-5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      currentStep >= 1
                        ? "bg-white text-red-500"
                        : "bg-white/20 text-white/60"
                    }`}
                  >
                    {currentStep > 1 ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      "1"
                    )}
                  </div>
                  <span className="text-xs font-medium text-white/80 hidden sm:inline">
                    Basic Info
                  </span>
                </div>

                <div
                  className={`flex-1 h-0.5 rounded-full max-w-[60px] transition-all duration-500 ${
                    currentStep > 1 ? "bg-white" : "bg-white/20"
                  }`}
                />

                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      currentStep >= 2
                        ? "bg-white text-red-500"
                        : "bg-white/20 text-white/60"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs font-medium text-white/80 hidden sm:inline">
                    Details & Bio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateProfile}>
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-5">
                {/* Full Name */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-red-500 transition-colors duration-200">
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center group-focus-within:bg-red-100 transition-colors duration-200">
                      <User
                        size={14}
                        className="text-red-500"
                      />
                    </div>
                    Full Name
                    <span className="text-red-400 text-xs">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl
                      focus:ring-4 focus:ring-red-500/10 focus:border-red-400
                      outline-none transition-all duration-200
                      hover:border-gray-300 text-gray-900 placeholder-gray-400
                      bg-gray-50/50 focus:bg-white text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Niche */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-orange-500 transition-colors duration-200">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center group-focus-within:bg-orange-100 transition-colors duration-200">
                      <Target
                        size={14}
                        className="text-orange-500"
                      />
                    </div>
                    Niche
                    <span className="text-red-400 text-xs">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.niche}
                    onChange={(e) =>
                      setFormData({ ...formData, niche: e.target.value })
                    }
                    placeholder="e.g., Fashion, Tech, Fitness, Travel"
                    className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl
                      focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400
                      outline-none transition-all duration-200
                      hover:border-gray-300 text-gray-900 placeholder-gray-400
                      bg-gray-50/50 focus:bg-white text-sm sm:text-base"
                    required
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    Your primary area of expertise or content focus
                  </p>
                </div>

                {/* Location */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-rose-500 transition-colors duration-200">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center group-focus-within:bg-rose-100 transition-colors duration-200">
                      <MapPin
                        size={14}
                        className="text-rose-500"
                      />
                    </div>
                    Location
                    <span className="text-red-400 text-xs">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="City, Country"
                    className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl
                      focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400
                      outline-none transition-all duration-200
                      hover:border-gray-300 text-gray-900 placeholder-gray-400
                      bg-gray-50/50 focus:bg-white text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Step 1 Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl
                      hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800
                      transition-all duration-200 font-semibold text-sm
                      active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isStep1Valid) {
                        notify.error("Please fill in all required fields");
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    disabled={!isStep1Valid}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3
                      bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl
                      hover:from-red-600 hover:to-rose-600
                      transition-all duration-200 font-semibold text-sm
                      shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                      active:scale-[0.98]"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details & Bio */}
            {currentStep === 2 && (
              <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-5">
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Audience Size */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-amber-600 transition-colors duration-200">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center group-focus-within:bg-amber-100 transition-colors duration-200">
                        <Users
                          size={14}
                          className="text-amber-500"
                        />
                      </div>
                      Audience Size
                      <span className="text-red-400 text-xs">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.audience_size || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          audience_size: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Total followers"
                      min="0"
                      className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl
                        focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400
                        outline-none transition-all duration-200
                        hover:border-gray-300 text-gray-900 placeholder-gray-400
                        bg-gray-50/50 focus:bg-white text-sm sm:text-base"
                      required
                    />
                    {formData.audience_size > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-amber-600">
                        {formatNumber(formData.audience_size)} followers
                      </p>
                    )}
                    {!formData.audience_size && (
                      <p className="mt-1.5 text-xs text-gray-400">
                        Total followers across all platforms
                      </p>
                    )}
                  </div>

                  {/* Engagement Rate */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors duration-200">
                      <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center group-focus-within:bg-green-100 transition-colors duration-200">
                        <TrendingUp
                          size={14}
                          className="text-green-500"
                        />
                      </div>
                      Engagement Rate
                      <span className="text-red-400 text-xs">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.engagement_rate || ""}
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
                        className="w-full px-4 py-3 sm:py-3.5 pr-10 border-2 border-gray-200 rounded-xl
                          focus:ring-4 focus:ring-green-500/10 focus:border-green-400
                          outline-none transition-all duration-200
                          hover:border-gray-300 text-gray-900 placeholder-gray-400
                          bg-gray-50/50 focus:bg-white text-sm sm:text-base"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                        %
                      </span>
                    </div>
                    {formData.engagement_rate > 0 && (
                      <p
                        className={`mt-1.5 text-xs font-medium ${getEngagementColor(
                          formData.engagement_rate
                        )}`}
                      >
                        {getEngagementLabel(formData.engagement_rate)} engagement
                      </p>
                    )}
                    {!formData.engagement_rate && (
                      <p className="mt-1.5 text-xs text-gray-400">
                        Average engagement percentage
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-violet-500 transition-colors duration-200">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center group-focus-within:bg-violet-100 transition-colors duration-200">
                      <FileText
                        size={14}
                        className="text-violet-500"
                      />
                    </div>
                    Bio
                    <span className="text-red-400 text-xs">*</span>
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell brands about yourself, your content style, and what makes you unique..."
                    rows={5}
                    maxLength={500}
                    className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl
                      focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400
                      outline-none transition-all duration-200
                      hover:border-gray-300 text-gray-900 placeholder-gray-400
                      bg-gray-50/50 focus:bg-white resize-none text-sm sm:text-base
                      leading-relaxed"
                    required
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-gray-400">
                      Share your story and what you bring to collaborations
                    </p>
                    <span
                      className={`text-xs font-semibold tabular-nums transition-colors ${
                        formData.bio.length > 450
                          ? "text-red-500"
                          : formData.bio.length > 0
                          ? "text-violet-500"
                          : "text-gray-300"
                      }`}
                    >
                      {formData.bio.length}/500
                    </span>
                  </div>
                </div>

                {/* Preview Card */}
                {isStep2Valid && (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 sm:p-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Profile Preview
                    </p>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {formData.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {formData.name}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />
                          {formData.location}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            <Target size={10} />
                            {formData.niche}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            <Users size={10} />
                            {formatNumber(formData.audience_size)}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <TrendingUp size={10} />
                            {formData.engagement_rate}%
                          </span>
                        </div>
                        {formData.bio && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                            {formData.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl
                      hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800
                      transition-all duration-200 font-semibold text-sm
                      active:scale-[0.98]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !isStep2Valid}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3
                      bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl
                      hover:from-red-600 hover:to-rose-600
                      transition-all duration-200 font-semibold text-sm
                      shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                      active:scale-[0.98]"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Profile...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Create Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-4 px-4">
          By creating a profile, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
}