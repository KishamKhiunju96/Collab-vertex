export interface AnalyticsData {
  month: string;
  reach: number;
  engagement: number;
}

export const analyticsData: AnalyticsData[] = [
  { month: "Jan", reach: 10, engagement: 15 },
  { month: "Feb", reach: 20, engagement: 30 },
  { month: "Mar", reach: 30, engagement: 45 },
  { month: "Apr", reach: 40, engagement: 60 },
  { month: "May", reach: 50, engagement: 75 },
  { month: "Jun", reach: 60, engagement: 90 },
  { month: "Jul", reach: 70, engagement: 105 },
];
