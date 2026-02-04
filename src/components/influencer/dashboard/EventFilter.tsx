"use client";

interface Props {
  filters: any;
  onChange: (filters: any) => void;
  onApply: () => void;
}

export default function EventFilter({ filters, onChange, onApply }: Props) {
  return (
    <div className="bg-white border rounded-xl p-5 h-fit sticky top-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Location */}
      <input
        className="w-full border rounded-md px-3 py-2 mb-3"
        placeholder="Location"
        value={filters.location}
        onChange={(e) =>
          onChange({ ...filters, location: e.target.value })
        }
      />

      {/* Category */}
      <input
        className="w-full border rounded-md px-3 py-2 mb-3"
        placeholder="Category"
        onChange={(e) =>
          onChange({
            ...filters,
            categories: [e.target.value],
          })
        }
      />

      {/* Target Audience */}
      <input
        className="w-full border rounded-md px-3 py-2 mb-3"
        placeholder="Target Audience"
        value={filters.target_audience}
        onChange={(e) =>
          onChange({ ...filters, target_audience: e.target.value })
        }
      />

      {/* Start Date */}
      <input
        type="date"
        className="w-full border rounded-md px-3 py-2 mb-4"
        onChange={(e) =>
          onChange({ ...filters, start_date: e.target.value })
        }
      />

      <button
        onClick={onApply}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
      >
        Apply Filters
      </button>
    </div>
  );
}
