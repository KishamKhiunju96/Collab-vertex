import Image from "next/image";
import { cn } from "@/features/lib/utils";

interface RoleCardProps {
  role: "Brand" | "Influencer";
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  accentColor: "blue" | "green";
  selected?: boolean;
  onClick?: () => void;
}

export default function RoleCard({
  title,
  description,
  imageUrl,
  buttonText,
  accentColor,
  selected = false,
  onClick,
}: RoleCardProps) {
  const borderColor = accentColor === "blue" ? "border-indigo-500" : "border-green-500";
  const selectedBg = accentColor === "blue" ? "bg-indigo-600" : "bg-green-600";

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer border-2 transition-colors",
        selected ? borderColor : "border-transparent",
        "hover:border-gray-300"
      )}
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl || "/images/placeholder.jpg"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="p-5 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {description}
        </p>

        <button
          className={cn(
            "w-full py-2.5 rounded-lg font-medium text-sm transition-colors",
            selected
              ? `${selectedBg} text-white`
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          disabled={selected}
        >
          {selected ? "Selected" : buttonText}
        </button>
      </div>
    </div>
  );
}