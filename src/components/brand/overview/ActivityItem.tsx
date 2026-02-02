import { BrandActivity } from "@/types/brandActivity";

interface Props {
  activity: BrandActivity;
}

export function ActivityItem({ activity }: Props) {
  const Icon = activity.icon;

  return (
    <div className="flex gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${activity.color}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold text-primary">
          {activity.title}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {activity.description}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {activity.time}
        </p>
      </div>
    </div>
  );
}
