import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-98",
  {
    variants: {
      variant: {
        default: 
          "bg-button-primary-DEFAULT text-button-primary-text hover:bg-button-primary-hover active:bg-button-primary-active shadow-md hover:shadow-lg focus-visible:ring-button-primary-ring",
        
        secondary:
          "bg-button-secondary-DEFAULT text-button-secondary-text hover:bg-button-secondary-hover active:bg-button-secondary-active shadow-md hover:shadow-lg focus-visible:ring-button-secondary-ring",
        
        success:
          "bg-button-success-DEFAULT text-button-success-text hover:bg-button-success-hover active:bg-button-success-active shadow-md hover:shadow-lg focus-visible:ring-button-success-ring",
        
        destructive:
          "bg-text-error text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg focus-visible:ring-red-500/30",
        
        outline:
          "border-2 border-button-tertiary-border bg-white text-button-tertiary-text hover:bg-button-tertiary-hover active:bg-button-tertiary-active focus-visible:ring-button-primary-ring",
        
        ghost: 
          "text-text-secondary hover:bg-background-muted hover:text-text-primary active:bg-background-surface",
        
        link: 
          "text-button-tertiary-text underline-offset-4 hover:underline px-0",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
