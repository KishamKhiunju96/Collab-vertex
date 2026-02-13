"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsData } from "./analyticsData";

// Custom Tooltip Component
interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}:</span>
            <span className="text-sm font-bold text-gray-900">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsChart() {
  return (
    <Card className="analytics-card border-0">
      <CardHeader className="analytics-header">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="analytics-title">Event Performance</CardTitle>
            <p className="analytics-subtitle">
              Reach and engagement over the last 7 months
            </p>
          </div>

          {/* Stats Summary */}
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Total Reach
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {analyticsData
                  .reduce((sum, item) => sum + item.reach, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Total Engagement
              </p>
              <p className="text-2xl font-bold text-teal-600">
                {analyticsData
                  .reduce((sum, item) => sum + item.engagement, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analyticsData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                vertical={false}
              />

              {/* Axes */}
              <XAxis
                dataKey="month"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
                dx={-10}
              />

              {/* Tooltip */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(108, 92, 231, 0.05)" }}
              />

              {/* Areas */}
              <defs>
                <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="engagementGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2ED8B6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2ED8B6" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="reach"
                stroke="#6C5CE7"
                strokeWidth={3}
                fill="url(#reachGradient)"
                name="Reach"
                animationDuration={1000}
              />

              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#2ED8B6"
                strokeWidth={3}
                fill="url(#engagementGradient)"
                name="Engagement"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="analytics-legend">
          <div className="analytics-legend-item">
            <span
              className="analytics-legend-dot"
              style={{
                background: "linear-gradient(135deg, #6C5CE7 0%, #5A4BD8 100%)",
              }}
            />
            <span className="analytics-legend-label">Reach</span>
          </div>

          <div className="analytics-legend-item">
            <span
              className="analytics-legend-dot"
              style={{
                background: "linear-gradient(135deg, #2ED8B6 0%, #26C9A7 100%)",
              }}
            />
            <span className="analytics-legend-label">Engagement</span>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22C55E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Performance Trend</p>
              <p className="text-xs text-gray-500">
                +12.5% increase this month
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Avg. Engagement Rate</p>
            <p className="text-lg font-bold text-purple-600">24.3%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
