"use client";

import React, { useState } from "react";
import { Building2, MapPin, Globe, FileText, X, Sparkles } from "lucide-react";
import { brandService, CreateBrandPayload, Brand } from "@/api/services/brandService";
import { notify } from "@/utils/notify";

interface CreateBrandFormProps {
  onSuccess?: (brand: Brand) => void;
  onCancel?: () => void;
}

export default function CreateBrandForm({
  onSuccess,
  onCancel,
}: CreateBrandFormProps) {
  const [form, setForm] = useState<CreateBrandPayload>({
    name: "",
    description: "",
    location: "",
    websiteUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.location) {
      notify.error("Name and Location are required");
      return;
    }

    try {
      setLoading(true);
      const newBrand = await brandService.createBrand(form);
      notify.success(`Brand "${newBrand.name}" created successfully`);
      setForm({
        name: "",
        description: "",
        location: "",
        websiteUrl: "",
      });
      onSuccess?.(newBrand);
    } catch (err: any) {
      notify.error(
          "Create Brand Limit Reached"
      );
    } finally {
      setLoading(false);
    }
  };

  const descriptionLength = (form.description || "").length;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 md:p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Card Container */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 overflow-hidden animate-[fadeInUp_0.5s_ease-out]">

        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-5 py-5 sm:px-8 sm:py-7 md:px-10 md:py-8">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5 blur-xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-white/[0.03]" />

          <div className="relative z-10 flex items-start gap-3 sm:gap-4">

            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                Create Your Brand
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-indigo-100/90 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Build your presence &amp; connect with influencers</span>
              </p>
            </div>
          </div>

          {/* Close button */}
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={loading}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/25 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Close form"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* ── Form Body ── */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-7 md:p-9 space-y-5 sm:space-y-6 md:space-y-7"
        >
          {/* ── Brand Name ── */}
          <fieldset className="group">
            <label
              htmlFor="brand-name"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-2.5 uppercase tracking-wide transition-colors group-focus-within:text-indigo-600"
            >
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 transition-transform group-hover:scale-110" />
              Brand Name
              <span className="text-red-500 text-sm normal-case tracking-normal">*</span>
            </label>
            <input
              id="brand-name"
              type="text"
              placeholder="Enter your brand name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-gray-50/50 border-2 border-gray-200 rounded-xl sm:rounded-2xl outline-none transition-all duration-200 hover:border-indigo-300 hover:bg-white focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </fieldset>

          {/* ── Description ── */}
          <fieldset className="group">
            <label
              htmlFor="brand-description"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-2.5 uppercase tracking-wide transition-colors group-focus-within:text-purple-600"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 transition-transform group-hover:scale-110" />
              Description
            </label>
            <textarea
              id="brand-description"
              placeholder="Tell influencers about your brand, vision, and what makes you unique..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-gray-50/50 border-2 border-gray-200 rounded-xl sm:rounded-2xl outline-none transition-all duration-200 hover:border-purple-300 hover:bg-white focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 resize-y min-h-[100px] max-h-[220px] leading-relaxed scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            />
            <div className="mt-1.5 flex items-center justify-between text-[11px] sm:text-xs text-gray-400 transition-colors group-focus-within:text-purple-400">
              <span>Share your brand story and collaboration goals</span>
              <span
                className={`tabular-nums font-medium transition-colors ${
                  descriptionLength > 0 ? "text-purple-500" : "text-gray-300"
                }`}
              >
                {descriptionLength}
              </span>
            </div>
          </fieldset>

          {/* ── Location ── */}
          <fieldset className="group">
            <label
              htmlFor="brand-location"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-2.5 uppercase tracking-wide transition-colors group-focus-within:text-emerald-600"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 transition-transform group-hover:scale-110" />
              Location
              <span className="text-red-500 text-sm normal-case tracking-normal">*</span>
            </label>
            <input
              id="brand-location"
              type="text"
              placeholder="City, Country"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-gray-50/50 border-2 border-gray-200 rounded-xl sm:rounded-2xl outline-none transition-all duration-200 hover:border-emerald-300 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
            <p className="mt-1.5 text-[11px] sm:text-xs text-gray-400 transition-colors group-focus-within:text-emerald-400">
              Your brand&apos;s primary location
            </p>
          </fieldset>

          {/* ── Website URL ── */}
          <fieldset className="group">
            <label
              htmlFor="brand-website"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-2.5 uppercase tracking-wide transition-colors group-focus-within:text-cyan-600"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 transition-transform group-hover:scale-110" />
              Website URL
            </label>
            <input
              id="brand-website"
              type="url"
              placeholder="https://yourbrand.com"
              value={form.websiteUrl}
              onChange={(e) =>
                setForm({ ...form, websiteUrl: e.target.value })
              }
              className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-gray-50/50 border-2 border-gray-200 rounded-xl sm:rounded-2xl outline-none transition-all duration-200 hover:border-cyan-300 hover:bg-white focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
            />
            <p className="mt-1.5 text-[11px] sm:text-xs text-gray-400 transition-colors group-focus-within:text-cyan-400">
              Your official website or landing page
            </p>
          </fieldset>

          {/* ── Divider ── */}
          <div className="border-t border-gray-100" />

          {/* ── Action Buttons ── */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-1 sm:pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="w-full sm:w-auto sm:flex-1 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-gray-600 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-[2] relative overflow-hidden px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 group/btn"
            >
              {/* Hover shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />

              {loading ? (
                <span className="relative z-10 flex items-center justify-center gap-2.5">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />
                  </svg>
                  Creating Brand…
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:scale-110" />
                  Create Brand
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}