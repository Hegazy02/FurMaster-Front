export interface TotalOrdersStatisticsResoponse {
  success: boolean;
  data: TotalOrdersStatistics;
}
export interface TotalOrdersStatistics {
  ordersCount: number;
  percentageChange: number;
  dailyCounts: { date: Date; count: number }[];
}
export interface TotalOrdersAmountStatisticsResoponse {
  success: boolean;
  data: TotalOrdersAmountStatistics;
}
export interface TotalOrdersAmountStatistics {
  totalAmount: number;
  percentageChange: number;
  dailyTotals: { date: Date; totalOrders: number }[];
}
