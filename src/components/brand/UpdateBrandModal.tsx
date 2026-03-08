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

  // Reset form when initial changes
  useEffect(() => {
    setForm(initial);
    setErrors({});
    setTouched({});
  }, [initial]);

  // Focus management
  useEffect(() => {
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [open]);

  // Handle escape key and focus trap
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        handleClose();
      }

      // Focus trap
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

    // Prevent body scroll
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

  const validateField = useCallback((field: keyof UpdateBrandPayload, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value?.trim()) return "Brand name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > 100) return "Name must be less than 100 characters";
        return undefined;
      
      case "description":
        if (value && value.length > 500) return "Description must be less than 500 characters";
        return undefined;
      
      case "location":
        if (value && value.length > 100) return "Location must be less than 100 characters";
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
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FieldError = {};
    
    (Object.keys(form) as Array<keyof UpdateBrandPayload>).forEach((field) => {
      const error = validateField(field, form[field] ?? "");
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, validateField]);

  const handleChange = useCallback((field: keyof UpdateBrandPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: keyof UpdateBrandPayload) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field] ?? "");
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, [form, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Mark all fields as touched
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

  const getInputClassName = (field: keyof UpdateBrandPayload, focusColor: string) => {
    const hasError = touched[field] && errors[field];
    const baseClasses = `
      w-full px-3 py-2.5 
      text-sm leading-relaxed
      border-2 rounded-lg
      bg-white
      text-gray-900 placeholder:text-gray-400
      transition-all duration-200 ease-out
      outline-none
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
      sm:px-4 sm:py-3 sm:text-base sm:rounded-xl
    `;
    
    if (hasError) {
      return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100`;
    }
    
    return `${baseClasses} border-gray-200 hover:border-gray-300 ${focusColor}`;
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 
        flex items-center justify-center 
        bg-black/60 backdrop-blur-sm 
        p-3 overflow-y-auto
        transition-opacity duration-200
        sm:p-4 md:p-6
        ${isClosing ? "opacity-0" : "opacity-100 animate-fadeIn"}
      `}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white w-full max-w-md 
          rounded-xl shadow-2xl 
          overflow-hidden 
          my-auto
          transition-all duration-200
          sm:max-w-lg sm:rounded-2xl
          lg:max-w-xl
          ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100 animate-scaleIn"}
        `}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 px-4 py-4 sm:px-6 sm:py-5">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl sm:w-64 sm:h-64" />
            <div className="absolute -bottom-1/2 -left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl sm:w-48 sm:h-48" />
          </div>

          <div className="relative z-10">
            <h2 
              id="modal-title"
              className="text-lg font-bold text-white pr-10 tracking-tight sm:text-xl md:text-2xl"
            >
              Update Brand Profile
            </h2>
            <p className="text-xs text-indigo-100 mt-0.5 font-medium sm:text-sm sm:mt-1">
              Edit your brand information
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="
              absolute top-3 right-3 
              p-1.5 
              text-white/80 hover:text-white
              hover:bg-white/20 
              rounded-full 
              transition-all duration-200 
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-white/50
              sm:top-4 sm:right-4 sm:p-2
            "
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto sm:p-6 sm:space-y-5 sm:max-h-[65vh]">
          {/* Name Field */}
          <div>
            <label 
              htmlFor="brand-name"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
            >
              <Building2 className="w-4 h-4 text-indigo-600 sm:w-[18px] sm:h-[18px]" />
              Brand Name
              <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="brand-name"
              type="text"
              className={getInputClassName("name", "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100")}
              placeholder="Enter your brand name"
              value={form.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              disabled={loading}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              maxLength={100}
            />
            {touched.name && errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 sm:text-sm">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label 
              htmlFor="brand-description"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
            >
              <FileText className="w-4 h-4 text-emerald-600 sm:w-[18px] sm:h-[18px]" />
              Description
            </label>
            <textarea
              id="brand-description"
              className={`
                ${getInputClassName("description", "focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100")}
                resize-none min-h-[80px] sm:min-h-[100px]
              `}
              placeholder="Describe your brand in a few sentences..."
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              disabled={loading}
              aria-invalid={!!errors.description}
              aria-describedby="description-help"
              maxLength={500}
            />
            <div id="description-help" className="mt-1.5 flex items-center justify-between text-xs text-gray-500">
              <span>Brief description of your brand</span>
              <span className={`tabular-nums ${(form.description?.length ?? 0) > 450 ? "text-amber-600" : ""}`}>
                {form.description?.length ?? 0}/500
              </span>
            </div>
            {touched.description && errors.description && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 sm:text-sm">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Location Field */}
          <div>
            <label 
              htmlFor="brand-location"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
            >
              <MapPin className="w-4 h-4 text-rose-600 sm:w-[18px] sm:h-[18px]" />
              Location
            </label>
            <input
              id="brand-location"
              type="text"
              className={getInputClassName("location", "focus:border-rose-500 focus:ring-4 focus:ring-rose-100")}
              placeholder="City, Country"
              value={form.location ?? ""}
              onChange={(e) => handleChange("location", e.target.value)}
              onBlur={() => handleBlur("location")}
              disabled={loading}
              aria-invalid={!!errors.location}
              maxLength={100}
            />
            {touched.location && errors.location && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 sm:text-sm">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Website URL Field */}
          <div>
            <label 
              htmlFor="brand-website"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
            >
              <Globe className="w-4 h-4 text-cyan-600 sm:w-[18px] sm:h-[18px]" />
              Website URL
            </label>
            <input
              id="brand-website"
              type="url"
              className={getInputClassName("websiteUrl", "focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100")}
              placeholder="https://yourbrand.com"
              value={form.websiteUrl ?? ""}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
              onBlur={() => handleBlur("websiteUrl")}
              disabled={loading}
              aria-invalid={!!errors.websiteUrl}
            />
            {touched.websiteUrl && errors.websiteUrl && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 sm:text-sm">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                {errors.websiteUrl}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-2.5 px-4 py-4 bg-gray-50 border-t border-gray-100 sm:flex-row sm:gap-3 sm:px-6 sm:py-5">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="
              flex-1 px-4 py-2.5 
              text-sm font-semibold text-gray-700
              bg-white
              border-2 border-gray-200 
              rounded-lg
              hover:bg-gray-50 hover:border-gray-300
              focus:outline-none focus:ring-4 focus:ring-gray-100
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              sm:py-3 sm:text-base sm:rounded-xl
            "
          >
            Cancel
          </button>

          <button
            ref={lastButtonRef}
            type="submit"
            disabled={loading}
            className="
              flex-1 px-4 py-2.5 
              text-sm font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-indigo-700
              rounded-lg
              shadow-lg shadow-indigo-500/25
              hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl hover:shadow-indigo-500/30
              focus:outline-none focus:ring-4 focus:ring-indigo-200
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
              sm:py-3 sm:text-base sm:rounded-xl
            "
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg 
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5" 
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
                <span>Updating...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Update Brand</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}