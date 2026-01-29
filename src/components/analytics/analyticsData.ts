export interface AnalyticsData {
  month: string;
  reach: number;
  engagement: number;
}

export const analyticsData: AnalyticsData[] = [
  { month: "Jan", reach: 120000, engagement: 45000 },
  { month: "Feb", reach: 180000, engagement: 62000 },
  { month: "Mar", reach: 250000, engagement: 89000 },
  { month: "Apr", reach: 320000, engagement: 110000 },
  { month: "May", reach: 410000, engagement: 145000 },
  { month: "Jun", reach: 520000, engagement: 180000 },
  { month: "Jul", reach: 680000, engagement: 230000 },
];
