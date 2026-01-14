"use client";

import { useState } from "react";

export default function ProfileForm() {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        className="border p-2 w-full"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <button className="px-4 py-2 bg-green-400 hover:bg-green-600 text-white rounded">
        Save changes
      </button>
    </form>
  );
}
