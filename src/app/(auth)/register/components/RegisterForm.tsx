"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (name.length < 2) newErrors.name = "Name must be at least 2 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase & number";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Mock API call
    await new Promise((r) => setTimeout(r, 1500));

    localStorage.setItem(
      "mockRegisteredUser",
      JSON.stringify({
        name,
        email,
        registeredAt: new Date().toISOString(),
      }),
    );

    setSuccess(true); // show success message

    setTimeout(() => {
      router.push("/login?registered=true");
    }, 2000);

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-6xl h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:flex h-full w-full overflow-hidden">
          <Image
            src="/images/collabR.jpg"
            alt="Register"
            width={400}
            height={400}
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="flex items-center justify-center px-12 p-10">
          <div className="w-full max-w-md">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Create Account
            </h2>
            {success && (
              <p className="mb-4 text-center text-green-600 font-medium">
                Registration successful! Redirecting to login...
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateForm();
                  }}
                  className="mt-1 w-full rounded-md border px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateForm();
                  }}
                  className="mt-1 w-full rounded-md border px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateForm();
                  }}
                  className="mt-1 w-full rounded-md border px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateForm();
                  }}
                  className="mt-1 w-full rounded-md border px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full rounded-md bg-green-400 py-2.5 text-text-primary font-semibold hover:bg-green-300
                disabled:opacity-70 transition-transform transform hover:scale-105"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-indigo-600 hover:underline">
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
