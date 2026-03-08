"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Target, 
  DollarSign, 
  FileText, 
  Tag,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Sparkles,
  Clock,
  X
} from "lucide-react";
import { eventService, EventPayload } from "@/api/services/eventService";
import { notify } from "@/utils/notify";

export interface CreateEventStepperProps {
  brandId: string;
  onCancel: () => void;
  onSubmit?: (data: EventPayload) => void;
}

// Make FieldError match all possible EventPayload keys
type FieldError = Partial<Record<keyof EventPayload, string>>;

// Type for touched fields
type TouchedFields = Partial<Record<keyof EventPayload, boolean>>;

const initialForm: EventPayload = {
  title: "",
  description: "",
  objectives: "",
  budget: 1,
  start_date: "",
  end_date: "",
  deliverables: "",
  target_audience: "",
  category: "",
  location: "",
  status: "active",
};

const STEPS = [
  { id: 1, title: "Basic Info", description: "Event details" },
  { id: 2, title: "Goals & Budget", description: "Objectives" },
  { id: 3, title: "Schedule", description: "Dates & location" },
];

export default function CreateEventStepper({
  brandId,
  onSubmit,
  onCancel,
}: CreateEventStepperProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<EventPayload>(initialForm);
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  
  const formRef = useRef<HTMLDivElement>(null);

  // Focus first input on step change
  useEffect(() => {
    if (formRef.current) {
      const firstInput = formRef.current.querySelector("input, textarea") as HTMLElement;
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }, [step]);

  const validateField = useCallback((field: keyof EventPayload, value: unknown): string | undefined => {
    const stringValue = typeof value === "string" ? value : "";
    const numberValue = typeof value === "number" ? value : 0;

    switch (field) {
      case "title":
        if (!stringValue.trim()) return "Event title is required";
        if (stringValue.length < 3) return "Title must be at least 3 characters";
        if (stringValue.length > 100) return "Title must be less than 100 characters";
        return undefined;
      
      case "description":
        if (!stringValue.trim()) return "Description is required";
        if (stringValue.length < 10) return "Description must be at least 10 characters";
        if (stringValue.length > 1000) return "Description must be less than 1000 characters";
        return undefined;
      
      case "objectives":
        if (!stringValue.trim()) return "Objectives are required";
        return undefined;
      
      case "budget":
        if (!numberValue || numberValue < 1) return "Budget must be at least 1";
        if (numberValue > 10000000) return "Budget seems too high";
        return undefined;
      
      case "start_date":
        if (!stringValue) return "Start date is required";
        if (new Date(stringValue) < new Date(new Date().setHours(0, 0, 0, 0))) {
          return "Start date cannot be in the past";
        }
        return undefined;
      
      case "end_date":
        if (!stringValue) return "End date is required";
        if (form.start_date && new Date(stringValue) < new Date(form.start_date)) {
          return "End date must be after start date";
        }
        return undefined;
      
      case "category":
        if (!stringValue.trim()) return "Category is required";
        return undefined;
      
      case "location":
        if (!stringValue.trim()) return "Location is required";
        return undefined;
      
      default:
        return undefined;
    }
  }, [form.start_date]);

  const validateStep = useCallback((stepNumber: number): boolean => {
    const fieldsToValidate: (keyof EventPayload)[] = 
      stepNumber === 1 ? ["title", "description"] :
      stepNumber === 2 ? ["objectives", "budget"] :
      ["start_date", "end_date", "category", "location"];

    const newErrors: FieldError = {};
    const newTouched: TouchedFields = { ...touched };

    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    setTouched(newTouched);
    setErrors((prev) => ({ ...prev, ...newErrors }));

    // Check if any of the validated fields have errors
    return !fieldsToValidate.some((field) => newErrors[field]);
  }, [form, touched, validateField]);

  const update = <K extends keyof EventPayload>(key: K, value: EventPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    
    if (touched[key]) {
      const error = validateField(key, value);
      setErrors((prev) => ({ ...prev, [key]: error }));
    }
  };

  const handleBlur = (field: keyof EventPayload) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const goNext = () => {
    if (validateStep(step)) {
      setDirection("forward");
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const goBack = () => {
    setDirection("backward");
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = async () => {
    if (!validateStep(3)) return;

    try {
      setLoading(true);
      await eventService.createEvent(brandId, form);
      notify.success("Event created successfully");
      onSubmit?.(form);
      onCancel();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create event";
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (field: keyof EventPayload, focusColor: string = "indigo") => {
    const hasError = touched[field] && errors[field];
    const colorMap: Record<string, string> = {
      indigo: "focus:border-indigo-500 focus:ring-indigo-100",
      emerald: "focus:border-emerald-500 focus:ring-emerald-100",
      rose: "focus:border-rose-500 focus:ring-rose-100",
      amber: "focus:border-amber-500 focus:ring-amber-100",
      cyan: "focus:border-cyan-500 focus:ring-cyan-100",
    };

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

    return `${baseClasses} border-gray-200 hover:border-gray-300 focus:ring-4 ${colorMap[focusColor] || colorMap.indigo}`;
  };

  const renderStepIndicator = () => (
    <div className="mb-6 sm:mb-8">
      {/* Mobile: Simple progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            Step {step} of 3
          </span>
          <span className="text-sm text-gray-500">
            {STEPS[step - 1].title}
          </span>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`
                flex-1 h-1.5 rounded-full transition-all duration-300
                ${step >= s.id ? "bg-indigo-600" : "bg-gray-200"}
              `}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Full step indicator */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>

        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                font-semibold text-sm transition-all duration-300
                ${step > s.id 
                  ? "bg-indigo-600 text-white" 
                  : step === s.id 
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-100" 
                    : "bg-gray-100 text-gray-400"
                }
              `}
            >
              {step > s.id ? (
                <Check className="w-5 h-5" />
              ) : (
                s.id
              )}
            </div>
            <div className="mt-2 text-center">
              <p className={`text-sm font-medium ${step >= s.id ? "text-gray-900" : "text-gray-400"}`}>
                {s.title}
              </p>
              <p className="text-xs text-gray-500 hidden lg:block">
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFieldError = (field: keyof EventPayload) => {
    if (!touched[field] || !errors[field]) return null;
    
    return (
      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 sm:text-sm">
        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        {errors[field]}
      </p>
    );
  };

  const renderStep1 = () => (
    <div 
      ref={formRef}
      className={`space-y-4 sm:space-y-5 animate-slideIn ${direction === "backward" ? "animate-slideInReverse" : ""}`}
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">Basic Information</h3>
          <p className="text-sm text-gray-500">Tell us about your event</p>
        </div>
      </div>

      {/* Title */}
      <div>
        <label 
          htmlFor="event-title"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          Event Title
          <span className="text-red-500">*</span>
        </label>
        <input
          id="event-title"
          type="text"
          className={getInputClassName("title", "indigo")}
          placeholder="Enter a compelling event title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          disabled={loading}
          maxLength={100}
        />
        {renderFieldError("title")}
        <p className="mt-1 text-xs text-gray-500 text-right">
          {form.title.length}/100
        </p>
      </div>

      {/* Description */}
      <div>
        <label 
          htmlFor="event-description"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          Description
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="event-description"
          className={`${getInputClassName("description", "emerald")} resize-none min-h-[120px] sm:min-h-[150px]`}
          placeholder="Describe your event in detail. What makes it special?"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          disabled={loading}
          rows={4}
          maxLength={1000}
        />
        {renderFieldError("description")}
        <p className={`mt-1 text-xs text-right ${form.description.length > 900 ? "text-amber-600" : "text-gray-500"}`}>
          {form.description.length}/1000
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div 
      ref={formRef}
      className={`space-y-4 sm:space-y-5 animate-slideIn ${direction === "backward" ? "animate-slideInReverse" : ""}`}
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Target className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">Goals & Budget</h3>
          <p className="text-sm text-gray-500">Define your objectives</p>
        </div>
      </div>

      {/* Objectives */}
      <div>
        <label 
          htmlFor="event-objectives"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
        >
          <Target className="w-4 h-4 text-amber-600" />
          Objectives
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="event-objectives"
          className={`${getInputClassName("objectives", "amber")} resize-none min-h-[100px] sm:min-h-[120px]`}
          placeholder="What do you want to achieve with this event?"
          value={form.objectives}
          onChange={(e) => update("objectives", e.target.value)}
          onBlur={() => handleBlur("objectives")}
          disabled={loading}
          rows={3}
        />
        {renderFieldError("objectives")}
      </div>

      {/* Budget */}
      <div>
        <label 
          htmlFor="event-budget"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
        >
          <DollarSign className="w-4 h-4 text-emerald-600" />
          Budget
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 sm:left-4">
            $
          </span>
          <input
            id="event-budget"
            type="number"
            className={`${getInputClassName("budget", "emerald")} pl-8 sm:pl-10`}
            placeholder="0.00"
            value={form.budget || ""}
            onChange={(e) => update("budget", Number(e.target.value))}
            onBlur={() => handleBlur("budget")}
            disabled={loading}
            min={1}
          />
        </div>
        {renderFieldError("budget")}
        <p className="mt-1 text-xs text-gray-500">
          Total budget for the event
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div 
      ref={formRef}
      className={`space-y-4 sm:space-y-5 animate-slideIn ${direction === "backward" ? "animate-slideInReverse" : ""}`}
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <div className="p-2 bg-cyan-100 rounded-lg">
          <Calendar className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">Schedule & Location</h3>
          <p className="text-sm text-gray-500">When and where</p>
        </div>
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Start Date */}
        <div>
          <label 
            htmlFor="event-start-date"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
          >
            <Clock className="w-4 h-4 text-cyan-600" />
            Start Date
            <span className="text-red-500">*</span>
          </label>
          <input
            id="event-start-date"
            type="date"
            className={getInputClassName("start_date", "cyan")}
            value={form.start_date}
            onChange={(e) => update("start_date", e.target.value)}
            onBlur={() => handleBlur("start_date")}
            disabled={loading}
            min={new Date().toISOString().split("T")[0]}
          />
          {renderFieldError("start_date")}
        </div>

        {/* End Date */}
        <div>
          <label 
            htmlFor="event-end-date"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
          >
            <Clock className="w-4 h-4 text-cyan-600" />
            End Date
            <span className="text-red-500">*</span>
          </label>
          <input
            id="event-end-date"
            type="date"
            className={getInputClassName("end_date", "cyan")}
            value={form.end_date}
            onChange={(e) => update("end_date", e.target.value)}
            onBlur={() => handleBlur("end_date")}
            disabled={loading}
            min={form.start_date || new Date().toISOString().split("T")[0]}
          />
          {renderFieldError("end_date")}
        </div>
      </div>

      {/* Category */}
      <div>
        <label 
          htmlFor="event-category"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
        >
          <Tag className="w-4 h-4 text-purple-600" />
          Category
          <span className="text-red-500">*</span>
        </label>
        <input
          id="event-category"
          type="text"
          className={getInputClassName("category", "indigo")}
          placeholder="e.g., Conference, Workshop, Meetup"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          onBlur={() => handleBlur("category")}
          disabled={loading}
        />
        {renderFieldError("category")}
      </div>

      {/* Location */}
      <div>
        <label 
          htmlFor="event-location"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:gap-2 sm:mb-2"
        >
          <MapPin className="w-4 h-4 text-rose-600" />
          Location
          <span className="text-red-500">*</span>
        </label>
        <input
          id="event-location"
          type="text"
          className={getInputClassName("location", "rose")}
          placeholder="Venue or virtual location"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          onBlur={() => handleBlur("location")}
          disabled={loading}
        />
        {renderFieldError("location")}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden sm:rounded-2xl lg:max-w-xl">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 px-4 py-4 sm:px-6 sm:py-5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
        </div>

        <div className="relative z-10">
          <h2 className="text-lg font-bold text-white pr-10 tracking-tight sm:text-xl md:text-2xl">
            Create New Event
          </h2>
          <p className="text-xs text-indigo-100 mt-0.5 font-medium sm:text-sm sm:mt-1">
            Set up your event in a few simple steps
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
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
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {renderStepIndicator()}

        <div className="min-h-[280px] sm:min-h-[320px]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-2.5 px-4 py-4 bg-gray-50 border-t border-gray-100 sm:flex-row sm:justify-between sm:gap-3 sm:px-6 sm:py-5">
        <button
          type="button"
          onClick={step === 1 ? onCancel : goBack}
          disabled={loading}
          className="
            flex items-center justify-center gap-2
            px-4 py-2.5 
            text-sm font-semibold text-gray-700
            bg-white
            border-2 border-gray-200 
            rounded-lg
            hover:bg-gray-50 hover:border-gray-300
            focus:outline-none focus:ring-4 focus:ring-gray-100
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            sm:py-3 sm:text-base sm:rounded-xl sm:flex-1
          "
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{step === 1 ? "Cancel" : "Back"}</span>
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              px-4 py-2.5 
              text-sm font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-indigo-700
              rounded-lg
              shadow-lg shadow-indigo-500/25
              hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl hover:shadow-indigo-500/30
              focus:outline-none focus:ring-4 focus:ring-indigo-200
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
              sm:py-3 sm:text-base sm:rounded-xl sm:flex-1
            "
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              px-4 py-2.5 
              text-sm font-semibold text-white
              bg-gradient-to-r from-emerald-600 to-emerald-700
              rounded-lg
              shadow-lg shadow-emerald-500/25
              hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:shadow-emerald-500/30
              focus:outline-none focus:ring-4 focus:ring-emerald-200
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
              sm:py-3 sm:text-base sm:rounded-xl sm:flex-1
            "
          >
            {loading ? (
              <>
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
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Event</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}