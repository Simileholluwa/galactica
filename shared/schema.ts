import { z } from "zod";

// Simple types without database dependencies
export interface LeaderboardUser {
  id: string;
  username: string;
  walletAddress: string;
  reputationPoints: number;
  level: number;
  dailyChange: number;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface NetworkStats {
  totalUsers: number;
  activeToday: number;
  totalRP: string;
  avgRP: string;
}

export const filterPeriodSchema = z.enum(["all", "week", "month", "today"]);
export type FilterPeriod = z.infer<typeof filterPeriodSchema>;
