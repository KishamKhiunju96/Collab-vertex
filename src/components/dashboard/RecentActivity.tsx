"use client";

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
      <ul className="flex flex-col gap-3">
        {activities.map((activity) => (
          <li key={activity.id} className="flex justify-between items-center">
            <span>
              {" "}
              {activity.user} {activity.action}
            </span>
            <span className="text-gray-400 text-sm">{activity.time} </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
