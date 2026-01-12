"use client";
import { authService } from "@/api/services/authService";
import Link from "next/link";
import { useState } from "react";

export default function DashboardHeader() {

  const [open, setOpen] = useState(false);
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-b-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="search"
          className="px-4 py-2 rounded-lg border-2  focus:outline-none focus:ring-2 focus:ring-green-500"
        ></input>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 text-black rounded-lg border hover:bg-green-500 transition">
              Profile
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
              <Link 
              href="/dashboard/profile"
              className="block px-4 py-2 text-sm hover:bg-green-300"
              onClick={() =>setOpen(false)}>
                My Profile
              </Link>

              <button
              onClick={authService.logout}
              className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-green-500">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
