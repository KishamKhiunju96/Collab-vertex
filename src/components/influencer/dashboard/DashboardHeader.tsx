import Link from "next/link";
import { useUserData } from "@/api/hooks/useUserData";

export default function DashboardHeader() {
  const { user } = useUserData();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-900">
        Hi! {user?.username ? `${user.username}, welcome to Collab-vertex 👋` : "Influencer"} 
      </h1>

      <Link
        href="/dashboard/influencerprofile"
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="font-medium text-gray-700">Profile</span>
      </Link>
    </header>
  );
}
