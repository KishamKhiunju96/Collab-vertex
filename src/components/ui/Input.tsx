import * as React from "react";
import { cn } from "@/features/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-text-primary mb-2">
            {label}
            {props.required && <span className="text-text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-icon-default pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex w-full rounded-xl border-2 border-border-subtle bg-white px-4 py-3 text-sm text-text-primary",
              "placeholder:text-text-muted",
              "transition-all duration-200",
              "hover:border-border-accent",
              "focus:border-button-primary-DEFAULT focus:ring-4 focus:ring-button-primary-ring focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background-disabled",
              error && "border-text-error focus:border-text-error focus:ring-red-500/20",
              icon && "pl-11",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "mt-2 text-xs",
              error ? "text-text-error font-medium" : "text-text-muted"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
