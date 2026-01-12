"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { z } from "zod";
import { authService } from "@/api/services/authService";
import { handleRegister } from "@/api/services/registerService";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "brand" | "influencer";
}

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "brand", // default, will be overridden
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("pendingUserRole");

    if (!storedRole || (storedRole !== "brand" && storedRole !== "influencer")) {
      router.replace("/select-role");
      return;
    }

    setForm((prev) => ({
      ...prev,
      role: storedRole as "brand" | "influencer",
    }));
  }, [router]);


  const formSchema = z
    .object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain uppercase, lowercase & number",
        ),
      confirmPassword: z.string(),
      role: z.enum(["brand", "influencer"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const data = await authService.register(payload);
      handleRegister(data);

      localStorage.removeItem("pendingUserRole");

      router.push(`/verify_otp?email=${encodeURIComponent(form.email)}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setApiError(
          err.response?.data?.message || err.message || "Registration failed",
        );
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
            alt="Register on Collab-vertex"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="flex items-center justify-center px-6 md:px-12 py-8">
          <div className="w-full max-w-md">
            <h2 className="mb-2 text-3xl font-bold">Create Account</h2>
            <p className="mb-6 text-gray-600 capitalize">
              Registering as <b>{form.role}</b>
            </p>

            {apiError && (
              <p className="mb-4 text-red-600 font-medium">{apiError}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                ["username", "Username", "text"],
                ["email", "Email", "email"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof FormData]}
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

              {[
                ["password", "Password"],
                ["confirmPassword", "Confirm Password"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="password"
                    value={form[key as keyof FormData]}
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
                className="w-full rounded-md bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60 shadow-md"
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
