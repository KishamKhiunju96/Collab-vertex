"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Optional: if you have a cn utility for className

interface RoleBadgeProps {
  title: string;
  description: string;
  icon: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function RoleBadge({
  title,
  description,
  icon,
  selected = false,
  onClick,
  disabled = false,
}: RoleBadgeProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 p-8 text-center transition-all duration-300 hover:shadow-xl",
        selected
          ? "border-indigo-600 bg-indigo-50 shadow-lg ring-4 ring-indigo-200 ring-opacity-50"
          : "border-gray-200 bg-white hover:border-gray-300",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      {/* Selected Checkmark */}
      {selected && (
        <div className="absolute right-4 top-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-2xl",
            selected ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700",
          )}
        >
          <div className="text-4xl">{icon}</div>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="mb-3 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
