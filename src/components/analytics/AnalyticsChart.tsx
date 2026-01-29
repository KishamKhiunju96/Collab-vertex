"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
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
          Campaign Performance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Reach and engagement over the last 7 months
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6C5CE7" stopOpacity={0} />
                </linearGradient>

                <linearGradient
                  id="engagementGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2ED8B6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2ED8B6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
              />

              <Tooltip
                cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                }}
                labelStyle={{ fontWeight: 600 }}
              />

              <Area
                type="monotone"
                dataKey="reach"
                stroke="#6C5CE7"
                strokeWidth={2}
                fill="url(#reachGradient)"
                name="Reach"
              />

              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#2ED8B6"
                strokeWidth={2}
                fill="url(#engagementGradient)"
                name="Engagement"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#6C5CE7]" />
            <span className="text-sm text-muted-foreground">Reach</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#2ED8B6]" />
            <span className="text-sm text-muted-foreground">Engagement</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
