"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { BrandActivity } from "@/types/brandActivity";
import { ActivityItem } from "./ActivityItem";

interface Props {
  activities: BrandActivity[];
}

export function ActivityFeed({ activities }: Props) {
  return (
    <Card className="activity-card border-0">
      <CardHeader className="activity-header">
        <CardTitle className="activity-title">Brand Activity</CardTitle>
        <p className="activity-subtitle">
          Track everything happening with your brand
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="activity-list">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                No Activity Yet
              </p>
              <p className="text-xs text-gray-500">
                Your brand activity will appear here
              </p>
            </div>
          ) : (
            activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </div>

        {/* Activity Summary Footer */}
        {activities.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-600">
                  {activities.length} activities tracked
                </span>
              </div>
              <button className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                View All →
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
