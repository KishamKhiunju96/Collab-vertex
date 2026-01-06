import Image from "next/image";
import { cn } from "@/lib/utils";

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
  const gradientOverlay =
    accentColor === "blue"
      ? "from-purple-900/80 via-transparent to-transparent"
      : "from-emerald-900/80 via-transparent to-transparent";

  const buttonGradient =
    accentColor === "blue"
      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700";

  const ringColor =
    accentColor === "blue" ? "ring-purple-500/50" : "ring-emerald-500/50";

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative h-[520px] rounded-2xl overflow-hidden shadow-xl cursor-pointer  transition-transform duration-500 hover:scale-105",
        selected && ` ${ringColor}  shadow-2xl`,
      )}
    >
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority
        className="object-cover transition-transform duration-700 hover:scale-110 "
      />

      <div className="absolute inset-0 bg-black  opacity-30" />
      <div
        className={cn("absolute inset-0 bg-gradient-to-b", gradientOverlay)}
      />

      <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
        <div className="text-center mt-12 ">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            {title}
          </h2>
          <p className="text-lg md:text-xl max-w-md mx-auto leading-relaxed opacity-95">
            {description}
          </p>
        </div>

        <div className="mt-auto ">
          <button
            className={cn(
              "w-full py-4 rounded-2xl border-2 border-t-teal-800 border-l-teal-800 text-xl font-bold text-gray-300 shadow-2xl transition-all transform hover:scale-105",
              selected ? buttonGradient : "bg-gray-800/15  ",
            )}
            disabled={selected}
          >
            {selected ? "✓ Selected" : buttonText}
          </button>
        </div>
      </div>

      {selected && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold backdrop-blur">
            <svg
              className="h-5 w-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
