import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally join class names together.
 * Combines clsx (for conditional classes) with tailwind-merge (to avoid conflicts).
 *
 * Example usage:
 * cn("p-4", condition && "bg-red-500", "rounded-lg")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
