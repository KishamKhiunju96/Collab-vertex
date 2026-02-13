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
    <div className=" flex items-center justify-center">
      <div
        onClick={onClick}
        className={cn(
          "relative h-[520px] w-[420px] rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-transform duration-500 hover:scale-105",
          selected && `ring-4 ${ringColor} shadow-2xl`,
        )}
      >
        <Image
          src={imageUrl || "/images/Branding2.jpg"}
          alt={`${title} branding illustration`}
          fill
          priority
          className="object-cover transition-transform duration-700 hover:scale-110"
        />

        <div className="absolute inset-0 bg-black opacity-30" />
        <div
          className={cn("absolute inset-0 bg-gradient-to-b", gradientOverlay)}
        />

        <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
          <div className="text-center mt-12">
            <h2 className="text-4xl font-extrabold mb-6">{title}</h2>
            <p className="text-lg max-w-md mx-auto opacity-95">{description}</p>
          </div>

          <button
            className={cn(
              "w-full py-4 rounded-2xl text-xl font-bold transition-all transform hover:scale-105",
              selected
                ? buttonGradient
                : "bg-gray-800/30 border border-white/20",
            )}
            disabled={selected}
          >
            {selected ? "✓ Selected" : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
