import { CreateInfluencerPayload } from "@/api/services/influencerService";

interface DashboardBodyProps {
  profile: CreateInfluencerPayload | null;
  onCreateClick: () => void;
}

export default function DashboardBody({
  profile,
  onCreateClick,
}: DashboardBodyProps) {
  return (
    <main className="flex flex-col items-center justify-center mt-24 px-4 text-center space-y-6">
      {!profile ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-800">
            Complete your Influencer Profile
          </h2>

          <p className="text-gray-600 max-w-md">
            Create your profile to start collaborating with brands and get
            discovered.
          </p>

          <button
            onClick={onCreateClick}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium
                       hover:bg-green-600 transition focus:outline-none focus:ring-2
                       focus:ring-green-400"
          >
            Create Profile
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-gray-800">
            Your profile is ready 🎉
          </h2>

          <p className="text-gray-600">
            Welcome back, <span className="font-medium">{profile.name}</span>!
            You can manage your profile from the Profile section.
          </p>
        </>
      )}
    </main>
  );
}
