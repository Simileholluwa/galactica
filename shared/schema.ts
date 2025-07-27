import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leaderboardUsers = pgTable("leaderboard_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  walletAddress: text("wallet_address").notNull().unique(),
  reputationPoints: integer("reputation_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  dailyChange: integer("daily_change").notNull().default(0),
  avatar: text("avatar").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeaderboardUserSchema = createInsertSchema(leaderboardUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLeaderboardUser = z.infer<typeof insertLeaderboardUserSchema>;
export type LeaderboardUser = typeof leaderboardUsers.$inferSelect;

export const filterPeriodSchema = z.enum(["all", "week", "month", "today"]);
export type FilterPeriod = z.infer<typeof filterPeriodSchema>;
