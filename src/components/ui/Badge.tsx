"use client";

import * as React from "react";
import { cn } from "@/features/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "secondary";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-background-surface text-text-secondary border-border-subtle",
      success: "bg-status-successBg text-status-successText border-green-300",
      warning: "bg-status-warningBg text-status-warningText border-yellow-300",
      error: "bg-status-errorBg text-status-errorText border-red-300",
      info: "bg-status-infoBg text-status-infoText border-blue-300",
      secondary: "bg-brand-primary-100 text-brand-primary-700 border-brand-primary-300",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 shadow-xs",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge };

