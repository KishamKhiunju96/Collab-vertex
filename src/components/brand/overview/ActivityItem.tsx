"use client";

import { BrandActivity } from "@/types/brandActivity";

interface Props {
  activity: BrandActivity;
}

export function ActivityItem({ activity }: Props) {
  const Icon = activity.icon;

  return (
    <div className="activity-item">
      <div className={`activity-icon ${activity.color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>

      <div className="activity-content">
        <p className="activity-item-title">{activity.title}</p>
        <p className="activity-item-description">{activity.description}</p>
        <p className="activity-item-time">{activity.time}</p>
      </div>
    </div>
  );
}
