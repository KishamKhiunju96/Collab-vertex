import Image from "next/image";

interface RoleCardProps {
  role: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  accentColor?: "red" | "green";
}

export default function RoleCard({
  role,
  title,
  description,
  imageUrl,
  buttonText,
  accentColor = "red",
}: RoleCardProps) {
  const borderColor =
    accentColor === "red" ? "border-red-500" : "border-green-500";

  const buttonStyle =
    accentColor === "red"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-600 hover:bg-green-700";

  return (
    <div
      className={`relative h-[500px] rounded-2xl overflow-hidden border-2 ${borderColor} shadow-lg transition-transform duration-300 hover:scale-105`}
    >
      <Image
        src={imageUrl}
        alt={role}
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute top-0 left-0 right-0 z-10 p-6 mt-16 text-white">
        <h2 className="text-3xl font-bold tracking-tight text-center">{title}</h2>
        <p className=" text-lg text-white max-w-md text-center">
          {description}
        </p>
      </div>

      <div className="relative z-10 h-full flex items-end p-6">
        <button
          className={`w-full py-3 rounded-xl text-lg font-semibold text-white transition-transform hover:scale-105 ${buttonStyle}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
