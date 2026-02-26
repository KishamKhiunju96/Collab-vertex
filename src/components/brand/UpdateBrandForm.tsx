"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { Building2, MapPin, Globe, FileText } from "lucide-react";
import { Brand, UpdateBrandPayload, brandService } from "@/api/services/brandService";

interface UpdateBrandFormProps {
  brand: Brand; 
  onUpdate: (updatedBrand: Brand) => void;
  onClose?: () => void;
}

export default function UpdateBrandForm({ brand, onUpdate, onClose }: UpdateBrandFormProps) {
  const [form, setForm] = useState<UpdateBrandPayload>({
    name: brand.name,
    description: brand.description ?? "",
    location: brand.location,
    websiteUrl: brand.websiteUrl ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedBrand = await brandService.updateBrand(brand.id, form);

      onUpdate({
        ...brand,
        name: updatedBrand.name,
        description: updatedBrand.description,
        location: updatedBrand.location,
        websiteUrl: updatedBrand.websiteUrl ?? form.websiteUrl,
        updatedAt: updatedBrand.updatedAt ?? new Date().toISOString(),
      });

      onClose?.();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to update brand profile");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update brand profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-border-subtle overflow-hidden hover:shadow-glow-lg transition-shadow duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-button-primary-DEFAULT via-brand-primary-500 to-brand-primary-600 px-4 sm:px-8 py-4 sm:py-6 relative overflow-hidden">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">Update Brand Profile</h2>
          <p className="text-xs sm:text-sm text-brand-primary-100 font-medium">Keep your brand information up to date</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        {error && (
          <div className="p-3 sm:p-4 bg-status-error/10 border-2 border-status-error/30 rounded-lg sm:rounded-xl animate-slideDown">
            <p className="text-xs sm:text-sm text-status-error font-medium">{error}</p>
          </div>
        )}

        {/* Brand Name */}
        <div className="group">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2 transition-colors group-focus-within:text-button-primary-DEFAULT">
            <Building2 size={16} className="sm:w-[18px] sm:h-[18px] text-button-primary-DEFAULT transition-transform group-hover:scale-110" />
            Brand Name
            <span className="text-text-error animate-pulse">*</span>
          </label>
          <div className="relative">
            <input
              name="name"
              type="text"
              placeholder="Brand Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-button-primary-ring focus:border-button-primary-DEFAULT outline-none transition-all duration-300 hover:border-button-primary-DEFAULT/50 text-text-primary placeholder:text-text-muted text-sm sm:text-base bg-white hover:shadow-md focus:shadow-lg"
            />
            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-button-primary-DEFAULT/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </div>

        {/* Description */}
        <div className="group">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
            <FileText size={16} className="sm:w-[18px] sm:h-[18px] text-brand-secondary-DEFAULT" />
            Description
          </label>
          <textarea
            name="description"
            placeholder="Tell brands about your company..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-secondary-DEFAULT/20 focus:border-brand-secondary-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted resize-none text-sm sm:text-base"
          />
          <p className="mt-1.5 text-xs text-text-muted">
            {(form.description || '').length} characters
          </p>
        </div>

        {/* Location */}
        <div className="group">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
            <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-brand-accent-DEFAULT" />
            Location
          </label>
          <input
            name="location"
            type="text"
            placeholder="City, Country"
            value={form.location}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-accent-DEFAULT/20 focus:border-brand-accent-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
          />
        </div>

        {/* Website URL */}
        <div className="group">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-primary mb-2">
            <Globe size={16} className="sm:w-[18px] sm:h-[18px] text-brand-highlight-DEFAULT" />
            Website URL
          </label>
          <input
            name="websiteUrl"
            type="url"
            placeholder="https://yourbrand.com"
            value={form.websiteUrl}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-border-subtle rounded-lg sm:rounded-xl focus:ring-4 focus:ring-brand-highlight-DEFAULT/20 focus:border-brand-highlight-DEFAULT outline-none transition-all duration-200 hover:border-border-accent text-text-primary placeholder:text-text-muted text-sm sm:text-base"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border-subtle">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-button-primary-DEFAULT via-brand-primary-500 to-brand-primary-600 text-white rounded-lg sm:rounded-xl hover:from-button-primary-hover hover:via-brand-primary-600 hover:to-brand-primary-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base relative overflow-hidden group"
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {loading ? (
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
                <span className="font-semibold">Updating...</span>
              </span>
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Building2 size={18} className="group-hover:scale-110 transition-transform" />
                Update Brand
              </span>
            )}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-button-tertiary-border text-button-tertiary-text rounded-lg sm:rounded-xl hover:bg-button-tertiary-hover hover:border-button-primary-DEFAULT transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base hover:shadow-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
