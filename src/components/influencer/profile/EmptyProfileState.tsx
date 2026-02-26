import { Plus, User, Target, TrendingUp, Users } from "lucide-react";

interface EmptyProfileStateProps {
  onCreateClick: () => void;
}

export default function EmptyProfileState({
  onCreateClick,
}: EmptyProfileStateProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={48} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Create Your Influencer Profile
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            You haven&apos;t created your influencer profile yet. Set up your
            profile to start collaborating with brands and accessing exciting
            opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Target size={24} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Showcase Your Niche
            </h3>
            <p className="text-sm text-gray-600">
              Highlight your expertise and attract brands in your industry.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Display Your Stats
            </h3>
            <p className="text-sm text-gray-600">
              Show your audience size and engagement rate to potential
              partners.
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Users size={24} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Connect with Brands
            </h3>
            <p className="text-sm text-gray-600">
              Get discovered by brands looking for influencers like you.
            </p>
          </div>
        </div>

        <button
          onClick={onCreateClick}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg flex items-center gap-2 mx-auto shadow-lg"
        >
          <Plus size={24} />
          Create My Profile
        </button>
      </div>
    </div>
  );
}
