import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import { BrandActivity } from "@/types/brandActivity";
import { ActivityItem } from "./ActivityItem";

interface Props {
  activities: BrandActivity[];
}

export function ActivityFeed({ activities }: Props) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Brand Activity
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track everything happening with your brand
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
