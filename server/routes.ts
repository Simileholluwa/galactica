import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { filterPeriodSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get leaderboard with optional filtering, search, and pagination
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { filter, search, page = "1", limit = "20" } = req.query;
      
      // Validate filter if provided
      if (filter && !filterPeriodSchema.safeParse(filter).success) {
        return res.status(400).json({ error: "Invalid filter parameter" });
      }

      // Validate pagination parameters
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      
      if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({ error: "Invalid page parameter" });
      }
      
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return res.status(400).json({ error: "Invalid limit parameter (1-100)" });
      }

      const result = await storage.getLeaderboard(
        filter as string | undefined, 
        search as string | undefined,
        pageNum,
        limitNum
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Search users
  app.get("/api/users/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search query is required" });
      }

      const users = await storage.searchUsers(q);
      res.json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get network stats
  app.get("/api/stats", async (req, res) => {
    try {
      const allUsersResult = await storage.getLeaderboard();
      const totalUsers = allUsersResult.total;
      const activeToday = Math.floor(totalUsers * 0.35); // Simulated
      const totalRP = allUsersResult.users.reduce((sum, user) => sum + user.reputationPoints, 0);

      res.json({
        totalUsers,
        activeToday,
        totalRP: Math.floor(totalRP / 1000) / 100 + "M" // Format as millions
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
