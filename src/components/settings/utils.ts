import { PasswordStrength } from "./types";

/**
 * Calculate password strength based on length
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { label: "", color: "", width: "0%" };
  if (password.length < 6)
    return { label: "Weak", color: "bg-red-500", width: "25%" };
  if (password.length < 8)
    return { label: "Fair", color: "bg-orange-500", width: "50%" };
  if (password.length < 12)
    return { label: "Good", color: "bg-yellow-500", width: "75%" };
  return { label: "Strong", color: "bg-green-500", width: "100%" };
}

/**
 * Validate password requirements
 */
export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters",
    };
  }
  return { valid: true };
}

/**
 * Validate passwords match
 */
export function validatePasswordsMatch(
  newPassword: string,
  confirmPassword: string
): { valid: boolean; message?: string } {
  if (newPassword !== confirmPassword) {
    return {
      valid: false,
      message: "Passwords do not match",
    };
  }
  return { valid: true };
}
