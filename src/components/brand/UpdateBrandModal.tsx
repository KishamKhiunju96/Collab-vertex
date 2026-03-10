"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Building2, MapPin, Globe, FileText, X, Check, AlertCircle } from "lucide-react";
import type { UpdateBrandPayload } from "@/api/services/brandService";

interface UpdateBrandModalProps {
  initial: UpdateBrandPayload;
  open: boolean;
  onClose: () => void;
  onUpdate: (payload: UpdateBrandPayload) => Promise<void> | void;
}

interface FieldError {
  name?: string;
  description?: string;
  location?: string;
  websiteUrl?: string;
}

export default function UpdateBrandModal({
  initial,
  open,
  onClose,
  onUpdate,
}: UpdateBrandModalProps) {
  const [form, setForm] = useState<UpdateBrandPayload>(initial);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isClosing, setIsClosing] = useState(false);

  const modalRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const lastButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setForm(initial);
    setErrors({});
    setTouched({});
  }, [initial]);

  useEffect(() => {
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        handleClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, loading]);

  const handleClose = useCallback(() => {
    if (loading) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [loading, onClose]);

  const validateField = useCallback(
    (field: keyof UpdateBrandPayload, value: string): string | undefined => {
      switch (field) {
        case "name":
          if (!value?.trim()) return "Brand name is required";
          if (value.length < 2) return "Name must be at least 2 characters";
          if (value.length > 100) return "Name must be less than 100 characters";
          return undefined;

        case "description":
          if (value && value.length > 500)
            return "Description must be less than 500 characters";
          return undefined;

        case "location":
          if (value && value.length > 100)
            return "Location must be less than 100 characters";
          return undefined;

        case "websiteUrl":
          if (value && value.trim()) {
            try {
              new URL(value);
            } catch {
              return "Please enter a valid URL";
            }
          }
          return undefined;

        default:
          return undefined;
      }
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FieldError = {};

    (Object.keys(form) as Array<keyof UpdateBrandPayload>).forEach((field) => {
      const error = validateField(field, form[field] ?? "");
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, validateField]);

  const handleChange = useCallback(
    (field: keyof UpdateBrandPayload, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof UpdateBrandPayload) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, form[field] ?? "");
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [form, validateField]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setTouched({
      name: true,
      description: true,
      location: true,
      websiteUrl: true,
    });

    if (!validateForm()) return;

    try {
      setLoading(true);
      await onUpdate(form);
      handleClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto transition-opacity duration-200 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto transition-all duration-200 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-7 sm:px-8 sm:py-8">
          <div className="absolute inset-0 overflow-hidden opacity-40">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2
              id="modal-title"
              className="text-2xl font-bold text-white tracking-tight"
            >
              Update Brand
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Modify your brand information
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="absolute top-5 right-5 p-2 text-white/70 hover:text-white hover:bg-white/15 rounded-lg transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Brand Name */}
          <div>
            <label
              htmlFor="brand-name"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2.5"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              Brand Name
              <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="brand-name"
              type="text"
              placeholder="Enter your brand name"
              value={form.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              disabled={loading}
              maxLength={100}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 border-2 rounded-lg outline-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                touched.name && errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />
            {touched.name && errors.name && (
              <p
                id="name-error"
                className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="brand-description"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2.5"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              Description
            </label>
            <textarea
              id="brand-description"
              placeholder="Tell us about your brand..."
              rows={4}
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              disabled={loading}
              maxLength={500}
              aria-invalid={!!errors.description}
              aria-describedby="description-help"
              className={`w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 border-2 rounded-lg outline-none transition-all duration-150 resize-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                touched.description && errors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 hover:border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              }`}
            />
            <div
              id="description-help"
              className="mt-2 flex items-center justify-between text-xs text-gray-500"
            >
              <span>Share your brand story</span>
              <span
                className={`font-medium ${
                  (form.description?.length ?? 0) > 450
                    ? "text-amber-600"
                    : "text-gray-400"
                }`}
              >
                {form.description?.length ?? 0}/500
              </span>
            </div>
            {touched.description && errors.description && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="brand-location"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2.5"
            >
              <MapPin className="w-4 h-4 text-rose-600" />
              Location
            </label>
            <input
              id="brand-location"
              type="text"
              placeholder="City, Country"
              value={form.location ?? ""}
              onChange={(e) => handleChange("location", e.target.value)}
              onBlur={() => handleBlur("location")}
              disabled={loading}
              maxLength={100}
              aria-invalid={!!errors.location}
              className={`w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 border-2 rounded-lg outline-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                touched.location && errors.location
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 hover:border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              }`}
            />
            {touched.location && errors.location && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="brand-website"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2.5"
            >
              <Globe className="w-4 h-4 text-cyan-600" />
              Website
            </label>
            <input
              id="brand-website"
              type="url"
              placeholder="https://yourbrand.com"
              value={form.websiteUrl ?? ""}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
              onBlur={() => handleBlur("websiteUrl")}
              disabled={loading}
              aria-invalid={!!errors.websiteUrl}
              className={`w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 border-2 rounded-lg outline-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                touched.websiteUrl && errors.websiteUrl
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 hover:border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              }`}
            />
            {touched.websiteUrl && errors.websiteUrl && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.websiteUrl}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Cancel
          </button>

          <button
            ref={lastButtonRef}
            type="submit"
            disabled={loading}
            className="flex-1 relative px-6 py-2.5 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Update Brand
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}