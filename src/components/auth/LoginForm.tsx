"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    if (!username || !password) {
      setApiError("Username and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/user/login",{
          usernameOrEmail: username, // backend le username or email accepts garxa
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data?.token;

      if (!token) {
        throw new Error("Token not found in response");
      }

      if (remember) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setApiError(
          err.response?.data?.message ||
            "Invalid username or password"
        );
      } else {
        setApiError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-6xl h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left */}
        <div className="p-12 flex flex-col justify-center">
          <h1 className="text-4xl text-center font-bold text-text-primary mb-8">
            Login to Collab-Vertex
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-primary">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-text-primary">
                Password
              </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-2 pr-12 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-xl text-gray-600 hover:text-gray-800"
                >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>


            <div className="flex items-center justify-between">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 text-green-400 rounded"
                />
                <span className="ml-2 text-sm text-text-primary">
                  Remember me
                </span>
              </label>

              <a href="#" className="text-sm text-red-400 hover:underline">
                Forgot Password
              </a>
            </div>

            {success && (
              <p className="text-green-600 font-medium text-center">
                {success}
              </p>
            )}

            {apiError && (
              <p className="text-red-600 font-medium text-center">
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-green-400 hover:bg-green-300 text-text-primary font-semibold rounded-lg disabled:opacity-70 transition-transform transform hover:scale-105"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-text-primary">
              Do not have an account?
              <a
                href="/register"
                className="text-indigo-600 px-2 font-medium hover:underline"
              >
                Register
              </a>
            </p>
          </form>
        </div>

        {/* Right Image */}
        <div className="hidden md:flex relative h-full w-full overflow-hidden">
          <Image
            src="/images/collabR.jpg"
            alt="Login"
            fill
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>
    </div>
  );
}
