"use client";

import { useState, useEffect } from "react";
import { Building2, MapPin, Globe, FileText, X } from "lucide-react";
import type { UpdateBrandPayload } from "@/api/services/brandService";

interface UpdateBrandModalProps {
  initial: UpdateBrandPayload;
  open: boolean;
  onClose: () => void;
  onUpdate: (payload: UpdateBrandPayload) => Promise<void> | void;
}

export default function UpdateBrandModal({
  initial,
  open,
  onClose,
  onUpdate,
}: UpdateBrandModalProps) {
  const [form, setForm] = useState<UpdateBrandPayload>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (
    field: keyof UpdateBrandPayload,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await onUpdate(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md sm:max-w-lg rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 animate-scaleIn hover:shadow-glow-lg transition-shadow duration-500"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-button-primary-DEFAULT via-brand-primary-500 to-brand-primary-600 px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white pr-10 tracking-tight">Update Brand Profile</h2>
            <p className="text-xs sm:text-sm text-brand-primary-100 mt-1 font-medium">Edit your brand information</p>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white disabled:opacity-50 hover:rotate-90 transform"
            aria-label="Close modal"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[calc(100vh-250px)] sm:max-h-[60vh] overflow-y-auto">
          {/* Name */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
              <Building2 size={16} className="sm:w-[18px] sm:h-[18px] text-button-primary-DEFAULT" />
              Name
              <span className="text-text-error">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
              placeholder="Brand Name"
              value={form.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
              <FileText size={16} className="sm:w-[18px] sm:h-[18px] text-brand-secondary-DEFAULT" />
              Description
            </label>
            <textarea
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-secondary-DEFAULT/20 focus:border-brand-secondary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted resize-none text-sm sm:text-base"
              placeholder="Describe your brand..."
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <p className="mt-1 text-xs text-text-muted">
              {(form.description ?? "").length} characters
            </p>
          </div>

          {/* Location */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
              <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-brand-accent-DEFAULT" />
              Location
            </label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-accent-DEFAULT/20 focus:border-brand-accent-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
              placeholder="City, Country"
              value={form.location ?? ""}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          {/* Website URL */}
          <div className="group">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
              <Globe size={16} className="sm:w-[18px] sm:h-[18px] text-brand-highlight-DEFAULT" />
              Website URL
            </label>
            <input
              type="url"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-highlight-DEFAULT/20 focus:border-brand-highlight-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
              placeholder="https://yourbrand.com"
              value={form.websiteUrl ?? ""}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 px-4 sm:px-6 py-4 sm:py-5 bg-background-alternate border-t border-border-subtle">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 sm:py-3 border-2 border-button-tertiary-border text-button-tertiary-text rounded-lg sm:rounded-xl hover:bg-button-tertiary-hover hover:border-button-primary-DEFAULT transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-button-primary-DEFAULT to-brand-primary-600 text-white rounded-lg sm:rounded-xl hover:from-button-primary-hover hover:to-brand-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm sm:text-base"
          >
            {loading ? (
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
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
