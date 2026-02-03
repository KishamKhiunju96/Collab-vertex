import React, { useState } from "react";
import { CreateInfluencerPayload, influencerService } from "@/api/services/influencerService";
import { notify } from "@/utils/notify";

interface InfluencerProfileFormProps {
  onSubmit: (newProfile: CreateInfluencerPayload) => void; // called after successful submission
}

const InfluencerProfileForm: React.FC<InfluencerProfileFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<CreateInfluencerPayload>({
    name: "",
    niche: "",
    audience_size: 0,
    engagement_rate: 0,
    bio: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "audience_size" || name === "engagement_rate" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await influencerService.createProfile(payload);
      notify.success("Profile created successfully!");
      onSubmit(payload); // close modal
    } catch (err) {
      console.error(err);
      notify.error("Failed to create profile.");
    }
  };

  return (
    <div className="flex flex-col gap-3 text-text-primary">
    <label className="block font-medium mb-1 ">Name</label>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />

    <label className="block font-medium mb-1 ">Niche</label>
      <input
        type="text"
        name="niche"
        placeholder="Niche"
        value={form.niche}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />

    <label className="block font-medium mb-1 ">Audience Size</label>  
      <input
        type="number"
        name="audience_size"
        placeholder="Audience Size"
        value={form.audience_size}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />

    <label className="block font-medium mb-1 ">Engagement Rate (%)</label>
      <input
        type="number"
        name="engagement_rate"
        placeholder="Engagement Rate (%)"
        value={form.engagement_rate}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />

    <label className="block font-medium mb-1 ">Bio</label>  
      <textarea
        name="bio"
        placeholder="Bio"
        value={form.bio}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />

    <label className="block font-medium mb-1 ">Location</label>
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Submit Profile
      </button>
    </div>
  );
};

export default InfluencerProfileForm;
