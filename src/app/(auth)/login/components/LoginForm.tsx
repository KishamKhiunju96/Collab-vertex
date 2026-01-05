"use client";
import { useState } from "react";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, remember });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-6xl h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-12 flex flex-col justify-center ">
          <h1 className="text-4xl text-center font-bold text-text-primary mb-8">
            Login to Collab-Vertex
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-primary">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-primary">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
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
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-400 hover:bg-green-300 text-text-primary font-semibold rounded-lg disabled:opacity-70 transition-transform transform hover:scale-105"
            >
              Login
            </button>
            <p className="text-center text-sm text-text-primary">
              Do not have an account?
              <a
                href="/register"
                className="text-indigo-600 px-2 font-medium hover:underline transition"
              >
                Register
              </a>
            </p>
          </form>
        </div>
        <div className="hidden md:flex relative h-full w-full overflow-hidden">
          <Image
            src="/images/collabR.jpg"
            alt="Login "
            width={400}
            height={400}
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>
    </div>
  );
}
