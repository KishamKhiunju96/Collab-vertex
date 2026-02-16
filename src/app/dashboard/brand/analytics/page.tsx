"use client";

import { useAuthProtection } from "@/api/hooks/useAuth";
import { BarChart3, TrendingUp, Users, Calendar, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

export default function AnalyticsPage() {
  const { loading, authenticated, role } = useAuthProtection();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <span className="text-lg text-gray-600 font-medium">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // Role protection
  if (!authenticated || role !== "brand") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Access denied. Brand accounts only.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your brand performance and collaboration metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs text-green-600 font-medium">+12.5%</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Total Reach</h3>
            <p className="text-2xl font-bold text-gray-900">2.4M</p>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs text-green-600 font-medium">+8.2%</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Engagement Rate</h3>
            <p className="text-2xl font-bold text-gray-900">4.8%</p>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs text-green-600 font-medium">+15.3%</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Active Collaborations</h3>
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-xs text-green-600 font-medium">+5.7%</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Total Events</h3>
            <p className="text-2xl font-bold text-gray-900">18</p>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Engagement Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Engagement Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Likes</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">125K</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Comments</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">8.5K</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Shares</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">12.3K</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Views</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">2.4M</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Performance
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                const heights = [40, 55, 45, 70, 60, 85];
                return (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                         style={{ height: `${heights[index]}%` }}
                         title={`${month}: ${heights[index]}%`}>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Performing Influencers */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Collaborations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Influencer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reach
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                        JD
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">Jane Doe</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Summer Launch 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    456K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-green-600 font-medium">5.8%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      High
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        MS
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">Mike Smith</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Product Review Campaign
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    312K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-green-600 font-medium">4.2%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Medium
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md p-8 text-center text-white">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">Advanced Analytics Coming Soon</h3>
          <p className="text-purple-100 max-w-2xl mx-auto">
            Get ready for detailed insights, predictive analytics, and comprehensive reporting tools
            to take your brand collaborations to the next level.
          </p>
        </div>
      </div>
    </div>
  );
}
