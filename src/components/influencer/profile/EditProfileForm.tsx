import { useState, useCallback } from "react";
import {
  User,
  MapPin,
  Target,
  Users,
  TrendingUp,
  FileText,
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  AlertCircle,
  Check,
} from "lucide-react";
import { notify } from "@/utils/notify";
import {
  InfluencerProfile,
  influencerService,
  UpdateInfluencerPayload,
  SocialLink,
} from "@/api/services/influencerService";
import { useSocialLinks } from "@/api/hooks/useSocialLinks";

interface EditProfileFormProps {
  profile: InfluencerProfile;
  onCancel: () => void;
  onSuccess: (profile: InfluencerProfile) => void;
}

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200" },
  { value: "twitter", label: "Twitter / X", icon: Twitter, color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-200" },
  { value: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { value: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  { value: "website", label: "Website", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { value: "other", label: "Other", icon: LinkIcon, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" },
];

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

  const {
    socialLinks,
    loading: socialLinksLoading,
    addLink,
    editLink,
    removeLink,
    refetch,
  } = useSocialLinks();

  const [showAddLink, setShowAddLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkSaving, setLinkSaving] = useState(false);
  const [linkDeleting, setLinkDeleting] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState({
    platform: "",
    url: "",
    followers: 0,
  });

  const resetLinkForm = useCallback(() => {
    setLinkForm({ platform: "", url: "", followers: 0 });
    setShowAddLink(false);
    setEditingLinkId(null);
  }, []);

  const handleAddLink = async () => {
    if (!linkForm.platform || !linkForm.url) {
      notify.error("Platform and URL are required");
      return;
    }

    // Basic URL validation
    try {
      new URL(linkForm.url);
    } catch {
      notify.error("Please enter a valid URL (e.g., https://...)");
      return;
    }

    setLinkSaving(true);
    try {
      await addLink({
        platform: linkForm.platform,
        url: linkForm.url,
        followers: linkForm.followers || 0,
      });
      // Force refetch to ensure the list is up to date
      await refetch();
      notify.success("Social link added successfully!");
      resetLinkForm();
    } catch (error) {
      console.error("Add link error:", error);
      notify.error("Failed to add social link");
    } finally {
      setLinkSaving(false);
    }
  };

  const handleEditLink = async (linkId: string) => {
    if (!linkForm.platform || !linkForm.url) {
      notify.error("Platform and URL are required");
      return;
    }

    try {
      new URL(linkForm.url);
    } catch {
      notify.error("Please enter a valid URL (e.g., https://...)");
      return;
    }

    setLinkSaving(true);
    try {
      await editLink(linkId, {
        platform: linkForm.platform,
        url: linkForm.url,
        followers: linkForm.followers || 0,
      });
      // Force refetch to ensure the list is up to date
      await refetch();
      notify.success("Social link updated successfully!");
      resetLinkForm();
    } catch (error) {
      console.error("Edit link error:", error);
      notify.error("Failed to update social link");
    } finally {
      setLinkSaving(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;

    setLinkDeleting(linkId);
    try {
      await removeLink(linkId);
      // Force refetch to ensure the list is up to date
      await refetch();
      notify.success("Social link deleted!");
    } catch (error) {
      console.error("Delete link error:", error);
      notify.error("Failed to delete social link");
    } finally {
      setLinkDeleting(null);
    }
  };

  const startEditLink = (link: SocialLink) => {
    setLinkForm({
      platform: link.platform,
      url: link.url,
      followers: link.followers || 0,
    });
    setEditingLinkId(link.id);
    setShowAddLink(true);
  };

  const getPlatformConfig = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    return (
      PLATFORM_OPTIONS.find((p) => lowerPlatform.includes(p.value)) ||
      PLATFORM_OPTIONS[PLATFORM_OPTIONS.length - 1]
    );
  };

  const getSocialIcon = (platform: string, size = 18) => {
    const config = getPlatformConfig(platform);
    const Icon = config.icon;
    return <Icon size={size} className={config.color} />;
  };

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
        formData
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-2xl lg:max-w-3xl min-h-screen sm:min-h-0 sm:max-h-[92vh] overflow-hidden flex flex-col">
        {/* ── Header ── */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Edit Profile
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-0.5">
              Update your influencer information
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50 text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Form Body ── */}
        <form
          onSubmit={handleUpdateProfile}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6"
        >
          {/* ─── Full Name ─── */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
              <User size={16} className="text-indigo-500" />
              Full Name
              <span className="text-red-500 text-xs">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your full name"
              className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base bg-white hover:border-gray-300"
              required
            />
          </div>

          {/* ─── Niche + Location Row ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <Target size={16} className="text-violet-500" />
                Niche
                <span className="text-red-500 text-xs">*</span>
              </label>
              <input
                type="text"
                value={formData.niche}
                onChange={(e) =>
                  setFormData({ ...formData, niche: e.target.value })
                }
                placeholder="e.g., Fashion, Tech"
                className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base hover:border-gray-300"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <MapPin size={16} className="text-rose-500" />
                Location
                <span className="text-red-500 text-xs">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, Country"
                className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base hover:border-gray-300"
                required
              />
            </div>
          </div>

          {/* ─── Audience + Engagement Row ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <Users size={16} className="text-blue-500" />
                Audience Size
                <span className="text-red-500 text-xs">*</span>
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
                className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base hover:border-gray-300"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <TrendingUp size={16} className="text-emerald-500" />
                Engagement Rate (%)
                <span className="text-red-500 text-xs">*</span>
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
                className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base hover:border-gray-300"
                required
              />
            </div>
          </div>

          {/* ─── Bio ─── */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
              <FileText size={16} className="text-amber-500" />
              Bio
              <span className="text-red-500 text-xs">*</span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell brands about yourself and what you do..."
              rows={3}
              className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none text-sm sm:text-base hover:border-gray-300"
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              {(formData.bio || "").length} characters
            </p>
          </div>

          {/* ════════════════════════════════════════════
              SOCIAL LINKS SECTION
             ════════════════════════════════════════════ */}
          <div className="border-t border-gray-100 pt-5 sm:pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <LinkIcon size={16} className="text-indigo-500" />
                Social Links
                {socialLinks.length > 0 && (
                  <span className="ml-1 text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                    {socialLinks.length}
                  </span>
                )}
              </h3>
              {!showAddLink && (
                <button
                  type="button"
                  onClick={() => {
                    resetLinkForm();
                    setShowAddLink(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-[0.97] transition-all duration-200 shadow-sm"
                >
                  <Plus size={15} />
                  <span className="hidden sm:inline">Add Link</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}
            </div>

            {/* ── Existing Links List ── */}
            {socialLinksLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : socialLinks.length > 0 ? (
              <div className="space-y-2 mb-4">
                {socialLinks.map((link) => {
                  const config = getPlatformConfig(link.platform);
                  const isDeleting = linkDeleting === link.id;

                  return (
                    <div
                      key={link.id}
                      className={`flex items-center gap-3 p-3 sm:p-3.5 border rounded-xl transition-all duration-200 ${
                        isDeleting
                          ? "opacity-50 pointer-events-none"
                          : "hover:shadow-sm"
                      } ${config.bg} ${config.border}`}
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm flex-shrink-0">
                        {getSocialIcon(link.platform)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 capitalize truncate">
                          {link.platform}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {link.url}
                        </p>
                        {link.followers != null && link.followers > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {link.followers.toLocaleString()} followers
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditLink(link)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white/80 rounded-lg transition-colors"
                          aria-label="Edit link"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink(link.id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-white/80 rounded-lg transition-colors disabled:opacity-50"
                          aria-label="Delete link"
                        >
                          {isDeleting ? (
                            <svg
                              className="animate-spin h-[15px] w-[15px]"
                              viewBox="0 0 24 24"
                            >
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
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              !showAddLink && (
                <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 mb-4">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                    <LinkIcon size={22} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    No social links yet
                  </p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Add your social media profiles to help brands discover and
                    connect with you.
                  </p>
                </div>
              )
            )}

            {/* ── Add / Edit Link Form ── */}
            {showAddLink && (
              <div className="border-2 border-indigo-200 rounded-xl bg-indigo-50/30 overflow-hidden">
                <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                  <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                    {editingLinkId ? (
                      <>
                        <Edit2 size={14} />
                        Edit Social Link
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Add New Social Link
                      </>
                    )}
                  </h4>
                </div>

                <div className="p-4 space-y-3.5">
                  {/* Platform Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Platform <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {PLATFORM_OPTIONS.map((platform) => {
                        const Icon = platform.icon;
                        const isSelected =
                          linkForm.platform.toLowerCase() === platform.value;
                        return (
                          <button
                            key={platform.value}
                            type="button"
                            onClick={() =>
                              setLinkForm({
                                ...linkForm,
                                platform: platform.value,
                              })
                            }
                            className={`flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                              isSelected
                                ? `${platform.bg} ${platform.border} ${platform.color} ring-2 ring-offset-1 ring-indigo-300`
                                : "bg-white border-gray-150 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <Icon size={18} />
                            <span className="truncate w-full text-center text-[11px] sm:text-xs">
                              {platform.label}
                            </span>
                            {isSelected && (
                              <Check
                                size={12}
                                className="absolute top-1 right-1"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Profile URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={linkForm.url}
                      onChange={(e) =>
                        setLinkForm({ ...linkForm, url: e.target.value })
                      }
                      placeholder="https://instagram.com/yourprofile"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-gray-900 placeholder:text-gray-400 hover:border-gray-300 transition-all"
                    />
                  </div>

                  {/* Followers */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Followers{" "}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="number"
                      value={linkForm.followers || ""}
                      onChange={(e) =>
                        setLinkForm({
                          ...linkForm,
                          followers: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      min="0"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-gray-900 placeholder:text-gray-400 hover:border-gray-300 transition-all"
                    />
                  </div>

                  {/* Validation hint */}
                  {linkForm.platform && !linkForm.url && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                      <AlertCircle size={14} />
                      Please enter the profile URL
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        editingLinkId
                          ? handleEditLink(editingLinkId)
                          : handleAddLink()
                      }
                      disabled={
                        linkSaving || !linkForm.platform || !linkForm.url
                      }
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.97] transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {linkSaving ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
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
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={15} />
                          {editingLinkId ? "Update Link" : "Save Link"}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetLinkForm}
                      disabled={linkSaving}
                      className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════
              BOTTOM ACTION BUTTONS
             ════════════════════════════════════════════ */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mt-6 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isUpdating}
              className="flex-1 px-5 py-2.5 sm:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-5 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isUpdating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 24 24"
                  >
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
