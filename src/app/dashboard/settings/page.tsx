"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const { loading, authenticated } = useAuthProtection();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    notifications: false,
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="text-lg">Loading settings...</span>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="text-sm text-gray-500">Redirecting...</span>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise((res) => setTimeout(res, 800));
      alert("Settings updated successfully");
    } catch {
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <section className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-500">
          Manage your account preferences and security.
        </p>
      </header>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Profile Information</h2>

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-md px-4 py-2"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded-md px-4 py-2"
          />
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-medium">Preferences</h2>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.notifications}
            onChange={() =>
              setForm({
                ...form,
                notifications: !form.notifications,
              })
            }
          />
          <span className="text-sm">Enable email notifications</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-md bg-green-400 hover:bg-green-500 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md border text-red-500 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </section>
  );
}
