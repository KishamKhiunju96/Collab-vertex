"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { z } from "zod";
import { authService } from "@/api/services/authService";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
    role: "brand", // brand | influencer
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const formSchema = z
    .object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain uppercase, lowercase & number (8+ chars)"
        ),
      confirmPassword: z.string(),
      phoneNumber: z.string().min(1, "Invalid phone number"),
      dateOfBirth: z.string().min(1, "Date of birth is required"),
      role: z.string().min(1, "Please select a role"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    const result = formSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const key = err.path[0] as string;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const roleMapping: Record<string, string> = {
        brand: "photographer",
        influencer: "organization",
      };

      const payload = {
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        dateOfBirth: new Date(form.dateOfBirth),
        role: roleMapping[form.role] || form.role,
      };

      await authService.register(payload);

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => router.push("/verify-otp"), 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setApiError(
          err.response?.data?.message || err.message || "Registration failed"
        );
      } else {
        setApiError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:block min-h-[700px]">
          <Image
            src="/images/collabR.jpg"
            alt="Register"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="flex items-center justify-center px-6 md:px-12 py-8">
          <div className="w-full max-w-md">
            <h2 className="mb-6 text-3xl font-bold">Create Account</h2>

            {success && (
              <p className="mb-4 text-green-600 font-medium">{success}</p>
            )}
            {apiError && (
              <p className="mb-4 text-red-600 font-medium">{apiError}</p>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-3 max-h-[600px] overflow-y-auto pr-2"
            >
              <div>
                <label className="text-sm font-medium block mb-1">
                  Select Role
                </label>
                <div className="flex gap-4">
                  {["brand", "influencer"].map((r) => (
                    <label key={r} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={form.role === r}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                      />
                      <span className="text-sm capitalize">{r}</span>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-xs text-red-600">{errors.role}</p>
                )}
              </div>

              {[
                ["username", "Username", "text"],
                ["name", "Full Name", "text"],
                ["email", "Email", "email"],
                ["phoneNumber", "Phone Number", "tel"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border px-4 py-2 text-sm"
                  />
                  {errors[key] && (
                    <p className="text-xs text-red-600">{errors[key]}</p>
                  )}
                </div>
              ))}

              <div>
                <label className="text-sm font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    setForm({ ...form, dateOfBirth: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border px-4 py-2 text-sm"
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-red-600">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {[
                ["password", "Password"],
                ["confirmPassword", "Confirm Password"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="password"
                    value={(form as any)[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border px-4 py-2 text-sm"
                  />
                  {errors[key] && (
                    <p className="text-xs text-red-600">{errors[key]}</p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60 shadow-md mt-4"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
