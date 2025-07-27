import { type LeaderboardUser, type InsertLeaderboardUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<LeaderboardUser | undefined>;
  getUserByUsername(username: string): Promise<LeaderboardUser | undefined>;
  createUser(user: InsertLeaderboardUser): Promise<LeaderboardUser>;
  getLeaderboard(filter?: string, search?: string, page?: number, limit?: number): Promise<{
    users: LeaderboardUser[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  searchUsers(query: string): Promise<LeaderboardUser[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, LeaderboardUser>;

  constructor() {
    this.users = new Map();
    this.seedData();
  }

  private seedData() {
    const spaceUsernames = [
      "AstroExplorer", "CosmicBuilder", "StarshipPilot", "NebulaTrader", "QuantumMiner",
      "GalacticScout", "VoidWalker", "OrbitMaster", "CosmosGuardian", "StellarVoyager",
      "SpaceRanger", "NebulaCrawler", "StarForge", "VoidSeeker", "GalaxyRider",
      "CosmicSage", "StellarMage", "QuantumLeap", "StardustHero", "SpaceWarden",
      "OrbitGuard", "NovaHunter", "CometTracker", "MeteorChaser", "SolarFlare",
      "BlackHoleExplorer", "WormholeNavigator", "PulsarDetective", "SupernovaWitness", "QuasarSeeker"
    ];
    
    const avatarLetters = ["A", "C", "S", "N", "Q", "G", "V", "O", "E", "R", "B", "H", "M", "P", "D", "F", "T", "L", "K", "W"];
    
    const sampleUsers: InsertLeaderboardUser[] = [];
    
    // Generate 120 users (will be limited to 100 in the response)
    for (let i = 0; i < 120; i++) {
      const baseRP = 20000 - (i * 150) + Math.floor(Math.random() * 300);
      const username = spaceUsernames[i % spaceUsernames.length] + (i > 29 ? Math.floor(i / 30) : "");
      const walletSuffix = i.toString().padStart(4, '0');
      
      sampleUsers.push({
        username,
        walletAddress: `0x${Math.random().toString(16).substr(2, 36)}${walletSuffix}`,
        reputationPoints: Math.max(100, baseRP),
        level: Math.max(1, Math.floor(baseRP / 500)),
        dailyChange: Math.floor(Math.random() * 400) - 100, // -100 to +300
        avatar: avatarLetters[i % avatarLetters.length]
      });
    }

    sampleUsers.forEach(user => {
      const id = randomUUID();
      const fullUser: LeaderboardUser = {
        ...user,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(id, fullUser);
    });
  }

  async getUser(id: string): Promise<LeaderboardUser | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<LeaderboardUser | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertLeaderboardUser): Promise<LeaderboardUser> {
    const id = randomUUID();
    const user: LeaderboardUser = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getLeaderboard(filter?: string, search?: string, page: number = 1, limit: number = 20): Promise<{
    users: LeaderboardUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let users = Array.from(this.users.values());

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.walletAddress.toLowerCase().includes(searchLower)
      );
    }

    // Sort by reputation points (descending)
    users.sort((a, b) => b.reputationPoints - a.reputationPoints);

    // Apply time-based filtering (simplified for demo)
    if (filter && filter !== "all") {
      // In a real implementation, this would filter based on actual timestamps
      // For now, we'll return all users but this is where time-based filtering would go
    }

    // Limit to first 100 rankings
    users = users.slice(0, 100);
    
    const total = users.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total,
      page,
      totalPages
    };
  }

  async searchUsers(query: string): Promise<LeaderboardUser[]> {
    const result = await this.getLeaderboard(undefined, query);
    return result.users;
  }
}

export const storage = new MemStorage();
