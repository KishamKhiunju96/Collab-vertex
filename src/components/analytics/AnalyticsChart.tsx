"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsData } from "./analyticsData";

export function AnalyticsChart() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Event Performance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Reach and engagement over the last 7 months
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
              />

              <Area
                type="monotone"
                dataKey="reach"
                stroke="#6C5CE7"
                fill="#6C5CE7"
                fillOpacity={0.2}
                name="Reach"
              />

              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#2ED8B6"
                fill="#2ED8B6"
                fillOpacity={0.2}
                name="Engagement"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Simple Legend */}
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Reach</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Engagement</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
