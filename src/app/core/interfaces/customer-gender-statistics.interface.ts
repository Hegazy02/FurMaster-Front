export interface CustomerGenderStatistics {
  monthly: { month: number; male: number; female: number }[];
  total: { male: number; female: number };
}
