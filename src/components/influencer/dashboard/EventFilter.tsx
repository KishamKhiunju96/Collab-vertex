"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type FilterPayload = {
  location: string;
  categories: string[];
};

interface EventFilterBarProps {
  onApply: (filters: FilterPayload) => void;
}

const LOCATIONS = ["Kathmandu", "Lalitpur", "Bhaktapur"];
const CATEGORIES = ["Music", "Tech", "Business", "Sports"];

export default function EventFilterBar({ onApply }: EventFilterBarProps) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleApply = () => {
    onApply({
      location,
      categories: category ? [category] : [],
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Location */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm"
      >
        <option value="">All Locations</option>
        {LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Apply Button */}
      <Button onClick={handleApply}>
        Apply Filters
      </Button>
    </div>
  );
}
