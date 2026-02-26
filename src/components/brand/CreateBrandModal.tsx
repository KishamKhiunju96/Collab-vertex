"use client";

import { useState } from "react";
import { Building2, MapPin, Globe, FileText, X } from "lucide-react";
import { notify } from "@/utils/notify";
import { brandService } from "@/api/services/brandService";

export default function CreateBrandModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    websiteUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.location.trim()) {
      notify.error("Brand name and location are required");
      return;
    }

    try {
      setLoading(true);

      const brand = await brandService.createBrand(form);

      notify.success(`Brand "${brand.name}" created successfully`);

      onCreated(); // refresh list
      onClose();   // close modal ONLY on success
    } catch (err: any) {
      console.error("Failed to create brand:", err);

      notify.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create brand"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl shadow-2xl relative animate-scaleIn overflow-hidden my-4 sm:my-8 hover:shadow-glow-lg transition-shadow duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-button-primary-DEFAULT via-brand-primary-500 to-brand-primary-600 px-4 sm:px-8 py-4 sm:py-6 relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white pr-12 tracking-tight">
              Create Your Brand Profile
            </h3>
            <p className="text-xs sm:text-sm text-brand-primary-100 mt-1 font-medium">
              Connect with influencers worldwide
            </p>
          </div>
          
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-3 sm:top-6 right-3 sm:right-6 p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white disabled:opacity-50 hover:rotate-90 transform"
            aria-label="Close modal"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] sm:max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Brand Name */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5 transition-colors group-focus-within:text-button-primary-DEFAULT">
              <Building2 size={16} className="sm:w-[18px] sm:h-[18px] text-button-primary-DEFAULT transition-transform group-hover:scale-110" />
              Brand Name
              <span className="text-text-error animate-pulse">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your brand name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-300 hover:border-button-primary-DEFAULT/50 text-text-primary placeholder:text-text-muted text-sm sm:text-base bg-white hover:shadow-md focus:shadow-lg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-button-primary-DEFAULT/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5 transition-colors group-focus-within:text-brand-secondary-DEFAULT">
              <FileText size={16} className="sm:w-[18px] sm:h-[18px] text-brand-secondary-DEFAULT transition-transform group-hover:scale-110" />
              Description
            </label>
            <div className="relative">
              <textarea
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-secondary-DEFAULT/20 focus:border-brand-secondary-DEFAULT outline-none transition-all duration-300 hover:border-brand-secondary-DEFAULT/50 text-text-primary placeholder:text-text-muted resize-none text-sm sm:text-base bg-white hover:shadow-md focus:shadow-lg"
                placeholder="Describe your brand, vision, and what makes it unique..."
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand-secondary-DEFAULT/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            <p className="mt-1.5 text-xs text-text-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 transition-colors group-focus-within:text-brand-secondary-DEFAULT/70">
              <span>Share what makes your brand special</span>
              <span className={`font-medium transition-colors ${(form.description || '').length > 0 ? 'text-brand-secondary-DEFAULT' : 'text-text-disabled'}`}>{(form.description || '').length} characters</span>
            </p>
          </div>

          {/* Location */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5">
              <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-brand-accent-DEFAULT" />
              Location
              <span className="text-text-error">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-accent-DEFAULT/20 focus:border-brand-accent-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
              placeholder="City, Country"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* Website URL */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-2.5">
              <Globe size={16} className="sm:w-[18px] sm:h-[18px] text-brand-highlight-DEFAULT" />
              Website URL
            </label>
            <input
              type="url"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-highlight-DEFAULT/20 focus:border-brand-highlight-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
              placeholder="https://yourbrand.com"
              value={form.websiteUrl}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
            />
            <p className="mt-1.5 text-xs text-text-muted">
              Your official website or landing page
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 px-4 sm:px-8 py-4 sm:py-6 bg-background-alternate border-t border-border-subtle">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-button-tertiary-border text-button-tertiary-text rounded-lg sm:rounded-xl hover:bg-button-tertiary-hover hover:border-button-primary-DEFAULT transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-button-primary-DEFAULT to-brand-primary-600 text-white rounded-lg sm:rounded-xl hover:from-button-primary-hover hover:to-brand-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                Creating...
              </span>
            ) : (
              "Create Brand"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
