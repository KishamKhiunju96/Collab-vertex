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
  Clock,
  X,
} from "lucide-react";
import { eventService, EventPayload } from "@/api/services/eventService";
import { notify } from "@/utils/notify";

export interface CreateEventStepperProps {
  brandId: string;
  onCancel: () => void;
  onSubmit?: (data: EventPayload) => void;
}

type FieldError = Partial<Record<keyof EventPayload, string>>;
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

  useEffect(() => {
    if (formRef.current) {
      const firstInput = formRef.current.querySelector(
        "input, textarea"
      ) as HTMLElement;
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }, [step]);

  const validateField = useCallback(
    (field: keyof EventPayload, value: unknown): string | undefined => {
      const stringValue = typeof value === "string" ? value : "";
      const numberValue = typeof value === "number" ? value : 0;

      switch (field) {
        case "title":
          if (!stringValue.trim()) return "Event title is required";
          if (stringValue.length < 3)
            return "Title must be at least 3 characters";
          if (stringValue.length > 100)
            return "Title must be less than 100 characters";
          return undefined;
        case "description":
          if (!stringValue.trim()) return "Description is required";
          if (stringValue.length < 10)
            return "Description must be at least 10 characters";
          if (stringValue.length > 1000)
            return "Description must be less than 1000 characters";
          return undefined;
        case "objectives":
          if (!stringValue.trim()) return "Objectives are required";
          return undefined;
        case "budget":
          if (!numberValue || numberValue < 1)
            return "Budget must be at least 1";
          if (numberValue > 10000000) return "Budget seems too high";
          return undefined;
        case "start_date":
          if (!stringValue) return "Start date is required";
          if (
            new Date(stringValue) < new Date(new Date().setHours(0, 0, 0, 0))
          ) {
            return "Start date cannot be in the past";
          }
          return undefined;
        case "end_date":
          if (!stringValue) return "End date is required";
          if (
            form.start_date &&
            new Date(stringValue) < new Date(form.start_date)
          ) {
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
    },
    [form.start_date]
  );

  const validateStep = useCallback(
    (stepNumber: number): boolean => {
      const fieldsToValidate: (keyof EventPayload)[] =
        stepNumber === 1
          ? ["title", "description"]
          : stepNumber === 2
            ? ["objectives", "budget"]
            : ["start_date", "end_date", "category", "location"];

      const newErrors: FieldError = {};
      const newTouched: TouchedFields = { ...touched };

      fieldsToValidate.forEach((field) => {
        newTouched[field] = true;
        const error = validateField(field, form[field]);
        if (error) newErrors[field] = error;
      });

      setTouched(newTouched);
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return !fieldsToValidate.some((field) => newErrors[field]);
    },
    [form, touched, validateField]
  );

  const update = <K extends keyof EventPayload>(
    key: K,
    value: EventPayload[K]
  ) => {
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
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to create event";
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const hasError = (field: keyof EventPayload) =>
    touched[field] && errors[field];

  const renderFieldError = (field: keyof EventPayload) => {
    if (!hasError(field)) return null;
    return (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-600 sm:mt-1.5 sm:text-sm">
        <AlertCircle className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
        {errors[field]}
      </p>
    );
  };

  const renderStepIndicator = () => (
    <div className="mb-5 sm:mb-7">
      {/* Mobile progress */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">
            Step {step}/3
          </span>
          <span className="text-xs text-gray-500">{STEPS[step - 1].title}</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                step >= s.id ? "bg-indigo-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop steps */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 -z-10 h-px bg-gray-200">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                step > s.id
                  ? "bg-indigo-500 text-white"
                  : step === s.id
                    ? "bg-indigo-500 text-white ring-4 ring-indigo-500/20"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s.id ? <Check className="h-4 w-4" /> : s.id}
            </div>
            <p
              className={`mt-1.5 text-xs font-medium ${
                step >= s.id ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {s.title}
            </p>
            <p className="hidden text-[11px] text-gray-400 lg:block">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const inputBase =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60 sm:rounded-xl sm:px-4 sm:py-3 sm:text-base";

  const inputOk =
    "border-gray-200 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10";

  const inputErr =
    "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/10";

  const cls = (field: keyof EventPayload, extra = "") =>
    `${inputBase} ${hasError(field) ? inputErr : inputOk} ${extra}`;

  const labelCls =
    "mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-600 sm:mb-1.5 sm:text-sm";

  const renderStep1 = () => (
    <div
      ref={formRef}
      key="step1"
      className={`space-y-4 sm:space-y-5 ${
        direction === "backward" ? "animate-slideInReverse" : "animate-slideIn"
      }`}
    >
      <div className="mb-3 flex items-center gap-2.5 sm:mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
            Basic Information
          </h3>
        </div>
      </div>

      <div>
        <label htmlFor="event-title" className={labelCls}>
          <FileText className="h-3.5 w-3.5 text-indigo-500" />
          Event Title
          <span className="text-red-400">*</span>
        </label>
        <input
          id="event-title"
          type="text"
          className={cls("title")}
          placeholder="Enter a compelling event title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          disabled={loading}
          maxLength={100}
        />
        {renderFieldError("title")}
        <p className="mt-0.5 text-right text-[11px] text-gray-400">
          {form.title.length}/100
        </p>
      </div>

      <div>
        <label htmlFor="event-description" className={labelCls}>
          <FileText className="h-3.5 w-3.5 text-emerald-500" />
          Description
          <span className="text-red-400">*</span>
        </label>
        <textarea
          id="event-description"
          className={cls("description", "min-h-[110px] resize-none sm:min-h-[140px]")}
          placeholder="Describe your event in detail. What makes it special?"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          disabled={loading}
          rows={4}
          maxLength={1000}
        />
        {renderFieldError("description")}
        <p
          className={`mt-0.5 text-right text-[11px] ${
            form.description.length > 900 ? "text-amber-500" : "text-gray-400"
          }`}
        >
          {form.description.length}/1000
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div
      ref={formRef}
      key="step2"
      className={`space-y-4 sm:space-y-5 ${
        direction === "backward" ? "animate-slideInReverse" : "animate-slideIn"
      }`}
    >
      <div className="mb-3 flex items-center gap-2.5 sm:mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
            Goals &amp; Budget
          </h3>
        </div>
      </div>

      <div>
        <label htmlFor="event-objectives" className={labelCls}>
          <Target className="h-3.5 w-3.5 text-amber-500" />
          Objectives
          <span className="text-red-400">*</span>
        </label>
        <textarea
          id="event-objectives"
          className={cls("objectives", "min-h-[90px] resize-none sm:min-h-[110px]")}
          placeholder="What do you want to achieve with this event?"
          value={form.objectives}
          onChange={(e) => update("objectives", e.target.value)}
          onBlur={() => handleBlur("objectives")}
          disabled={loading}
          rows={3}
        />
        {renderFieldError("objectives")}
      </div>

      <div>
        <label htmlFor="event-budget" className={labelCls}>
          <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
          Budget
          <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 sm:left-4">
            $
          </span>
          <input
            id="event-budget"
            type="number"
            className={cls("budget", "pl-7 sm:pl-9")}
            placeholder="0.00"
            value={form.budget || ""}
            onChange={(e) => update("budget", Number(e.target.value))}
            onBlur={() => handleBlur("budget")}
            disabled={loading}
            min={1}
          />
        </div>
        {renderFieldError("budget")}
        <p className="mt-0.5 text-[11px] text-gray-400">
          Total budget for the event
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div
      ref={formRef}
      key="step3"
      className={`space-y-4 sm:space-y-5 ${
        direction === "backward" ? "animate-slideInReverse" : "animate-slideIn"
      }`}
    >
      <div className="mb-3 flex items-center gap-2.5 sm:mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
            Schedule &amp; Location
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="event-start-date" className={labelCls}>
            <Clock className="h-3.5 w-3.5 text-sky-500" />
            Start Date
            <span className="text-red-400">*</span>
          </label>
          <input
            id="event-start-date"
            type="date"
            className={cls("start_date")}
            value={form.start_date}
            onChange={(e) => update("start_date", e.target.value)}
            onBlur={() => handleBlur("start_date")}
            disabled={loading}
            min={new Date().toISOString().split("T")[0]}
          />
          {renderFieldError("start_date")}
        </div>

        <div>
          <label htmlFor="event-end-date" className={labelCls}>
            <Clock className="h-3.5 w-3.5 text-sky-500" />
            End Date
            <span className="text-red-400">*</span>
          </label>
          <input
            id="event-end-date"
            type="date"
            className={cls("end_date")}
            value={form.end_date}
            onChange={(e) => update("end_date", e.target.value)}
            onBlur={() => handleBlur("end_date")}
            disabled={loading}
            min={form.start_date || new Date().toISOString().split("T")[0]}
          />
          {renderFieldError("end_date")}
        </div>
      </div>

      <div>
        <label htmlFor="event-category" className={labelCls}>
          <Tag className="h-3.5 w-3.5 text-violet-500" />
          Category
          <span className="text-red-400">*</span>
        </label>
        <input
          id="event-category"
          type="text"
          className={cls("category")}
          placeholder="e.g., Conference, Workshop, Meetup"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          onBlur={() => handleBlur("category")}
          disabled={loading}
        />
        {renderFieldError("category")}
      </div>

      <div>
        <label htmlFor="event-location" className={labelCls}>
          <MapPin className="h-3.5 w-3.5 text-rose-500" />
          Location
          <span className="text-red-400">*</span>
        </label>
        <input
          id="event-location"
          type="text"
          className={cls("location")}
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
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl sm:rounded-2xl lg:max-w-xl">
      {/* Header */}
      <div className="relative bg-indigo-600 px-4 py-4 sm:px-6 sm:py-5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-indigo-400/15 blur-xl" />
        </div>

        <div className="relative">
          <h2 className="pr-8 text-lg font-bold text-white sm:text-xl">
            Create New Event
          </h2>
          <p className="mt-0.5 text-xs text-indigo-200 sm:text-sm">
            Set up your event in a few simple steps
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute right-3 top-3 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50 sm:right-4 sm:top-4"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6">
        {renderStepIndicator()}

        <div className="min-h-[280px] sm:min-h-[320px]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/80 px-4 py-3 sm:flex-row sm:justify-between sm:gap-3 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={step === 1 ? onCancel : goBack}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:rounded-xl sm:py-2.5 sm:text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          {step === 1 ? "Cancel" : "Back"}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:rounded-xl sm:py-2.5 sm:text-sm"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:rounded-xl sm:py-2.5 sm:text-sm"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Create Event
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}