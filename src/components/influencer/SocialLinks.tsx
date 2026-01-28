import React, { useState } from "react";
import { useSocialLinks } from "../../api/hooks/useSocialLinks";

const platforms = ["instagram", "twitter", "facebook", "youtube", "tiktok", "linkedin"];

export default function SocialLinks() {
  const { socialLinks, loading, error, addLink, editLink, removeLink } = useSocialLinks();
  const [form, setForm] = useState({
    platform: "instagram",
    url: "",
    followers: 0,
    linked_at: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await editLink(editId, { ...form, followers: Number(form.followers) });
      setEditId(null);
    } else {
      await addLink({ ...form, followers: Number(form.followers) });
    }
    setForm({ platform: "instagram", url: "", followers: 0, linked_at: "" });
  };

  const handleEdit = (link: any) => {
    setEditId(link.id);
    setForm({
      platform: link.platform,
      url: link.url,
      followers: link.followers,
      linked_at: link.linked_at,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Social Links</h2>
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="platform"
          value={form.platform}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          {platforms.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
        <input
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="Profile URL"
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="followers"
          type="number"
          value={form.followers}
          onChange={handleChange}
          placeholder="Followers"
          className="border rounded px-3 py-2"
          min={0}
          required
        />
        <input
          name="linked_at"
          type="date"
          value={form.linked_at}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {editId ? "Update" : "Add"} Social Link
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : socialLinks.length === 0 ? (
          <div>No social links found.</div>
        ) : (
          socialLinks.map((link) => (
            <div key={link.id} className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-4 rounded border">
              <div>
                <div className="font-semibold">{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</div>
                <div className="text-sm text-gray-600">{link.url}</div>
                <div className="text-sm">Followers: {link.followers}</div>
                <div className="text-xs text-gray-400">Linked at: {link.linked_at}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(link)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => link.id && removeLink(link.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  disabled={!link.id}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
