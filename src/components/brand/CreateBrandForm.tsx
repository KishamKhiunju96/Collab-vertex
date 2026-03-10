"use client";

import React, { useState } from "react";
import { Building2, MapPin, Globe, FileText, X, Sparkles } from "lucide-react";
import { brandService, CreateBrandPayload, Brand } from "@/api/services/brandService";
import { notify } from "@/utils/notify";

interface CreateBrandFormProps {
  onSuccess?: (brand: Brand) => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

export default function CreateBrandForm({
  onSuccess,
  onCancel,
  isOpen = true,
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
      notify.error("Create Brand Limit Reached");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  const descriptionLength = (form.description || "").length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-lg my-8 animate-in fade-in zoom-in duration-300">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8 sm:py-10">

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          Create Your Brand
                          </h2>
                          <p className="mt-1 text-sm text-blue-100 flex items-center gap-2">
                            Connect with influencers
                          </p>
                        </div>
                      </div>

                  {/* Close button */}
                  {onCancel && (
                    <button
                      onClick={onCancel}
                      disabled={loading}
                      className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50"
                      aria-label="Close form"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 space-y-6"
            >
              {/* Brand Name */}
              <div className="space-y-2.5">
                <label
                  htmlFor="brand-name"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Brand Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="brand-name"
                  type="text"
                  placeholder="Enter your brand name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <label
                  htmlFor="brand-description"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <FileText className="w-4 h-4 text-purple-600" />
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
                  className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50 resize-none"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Share your brand story and goals</span>
                  <span className={`font-medium ${descriptionLength > 0 ? "text-purple-600" : "text-gray-400"}`}>
                    {descriptionLength} characters
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2.5">
                <label
                  htmlFor="brand-location"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Location
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="brand-location"
                  type="text"
                  placeholder="City, Country"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                />
                <p className="text-xs text-gray-500">
                  Your brand's primary location
                </p>
              </div>

              {/* Website URL */}
              <div className="space-y-2.5">
                <label
                  htmlFor="brand-website"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Globe className="w-4 h-4 text-cyan-600" />
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
                  className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-50"
                />
                <p className="text-xs text-gray-500">
                  Your official website or landing page
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-6" />

              {/* Action Buttons */}
              <div className="flex gap-3 sm:gap-4">
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:border-gray-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 relative px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-600/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 group overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {loading ? (
                    <span className="relative flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center gap-2">
                      + Create Brand
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}