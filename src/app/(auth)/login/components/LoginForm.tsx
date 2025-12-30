"use client";
import { useState } from "react";


export default function LoginForm(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, remember });
  };
  return (
    <div className="min-h-screen justify-center flex items-center bg-background-light">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-4xl text-center font-bold text-text-primary  mt-10">Login to Collab-Vertex</h1>
        <form onSubmit = {handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-primary">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail (e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-green-400 rounded-lg ">
            </input>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-text-primary">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword (e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-green-400 rounded-lg">
            </input>
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked = {remember}
                onChange={(e) => setRemember (e.target.checked)}
                className="h-4 w-4 text-green-400 rounded ">
                </input>
              <span className="ml-2 text-sm text-text-primary">Remember me</span>
            </label>
            <a href="" className="text-sm text-red-400 ">Forget Password</a>
          </div>
          <button
           type="submit"
           className="w-full py-2 px-4 bg-green-400 hover:bg-green-300 text-text-primary font-semibold rounded-lg transition-transform transform hover:scale-105">
             Login
          </button>
          <p className="text-center text-sm text-text-primary">
            Don't have an account?{""}
          <a href="/Register" className="text-red-400 px-4 fontfont-medium hover:text-red-600 transition">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}
