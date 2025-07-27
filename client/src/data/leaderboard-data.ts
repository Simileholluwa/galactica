// Static leaderboard data - no database or API dependencies
import type { LeaderboardUser, NetworkStats } from "@shared/schema";

// Generate static leaderboard data
const generateUser = (index: number): LeaderboardUser => {
  const usernames = [
    "AstroExplorer", "GalacticMiner", "CosmicTrader", "NebulaHunter", "StarshipPilot",
    "QuantumSeeker", "VoidWalker", "SolarFlare", "MeteorRider", "PlanetHopper",
    "GalaxyRanger", "SpaceNomad", "StellarCaptain", "OrbitMaster", "CosmicVoyager",
    "AsteroidMiner", "BlackHoleExplorer", "NovaGuardian", "PulsarNavigator", "WormholeRider",
    "StardustCollector", "GravityDefier", "CometChaser", "SupernovaWitness", "DarkMatterSeeker",
    "CrystalMiner", "TitaniumHarvester", "DiamondDigger", "PlatinumProspector", "GoldRusher",
    "EnergyTrader", "ResourceGuardian", "SpaceEngineer", "TechSavant", "DataAnalyst",
    "CyberPioneer", "DigitalNomad", "CodeCrusader", "AlgoMaster", "BlockchainBuilder",
    "CryptoKnight", "TokenTrader", "DeFiExplorer", "NFTCollector", "MetaverseMiner",
    "VirtualVoyager", "PixelPioneer", "GameChanger", "LevelMaster", "QuestCompleter",
    "AchievementHunter", "LeaderboardLegend", "RankingRoyalty", "ScoreSmasher", "PointPursuer",
    "ReputationRaider", "StatusSeeker", "PrestigePlayer", "EliteExplorer", "ChampionChaser",
    "VictoryVanguard", "TriumphTracker", "SuccessSeeker", "GloryGetter", "FameFollower",
    "HonorHunter", "PridePlayer", "DistinctionDriver", "ExcellenceExplorer", "MeritMaster",
    "WorthWinner", "ValueVanguard", "QualityQuester", "SuperiorSeeker", "PremiumPlayer",
    "TopTierTrader", "EliteEarner", "MasterMiner", "ChampionCollector", "LegendaryLeader",
    "MythicalMiner", "EpicExplorer", "RareRanger", "CommonCrusader", "BasicBuilder",
    "StandardSeeker", "RegularRaider", "NormalNavigator", "TypicalTrader", "AverageAdventurer",
    "GenericGamer", "PlainPlayer", "SimpleSeeker", "BasicBuilder", "CommonCrusader",
    "StandardStarship", "RegularRanger", "NormalNomad", "TypicalTitan", "AverageAstronaut",
    "GenericGalaxy", "PlainPilot", "SimpleSpaceMan", "BasicBountyHunter", "CommonCaptain",
    "StandardSoldier", "RegularRebel", "NormalNavigator", "TypicalTraveler", "AverageAgent",
    "GenericGuardian", "PlainProtector", "SimpleScout", "BasicBrawler", "CommonCommander",
    "StandardStrategist", "RegularRaider", "NormalNinja", "TypicalTactician", "AverageArcher",
    "GenericGladiator", "PlainPaladin", "SimpleSlayer", "BasicBerserker", "CommonCrusader"
  ];

  const avatarIcons = ["🚀", "⭐", "🌌", "🛸", "🌟", "💫", "🔮", "⚡", "🌠", "🎯"];
  
  const walletPrefixes = ["0xa1b2", "0xc3d4", "0xe5f6", "0x7890", "0xabcd", "0xef12", "0x3456", "0x789a", "0xbcde", "0xf012"];
  
  const baseRP = 10000 - (index * 100) + Math.floor(Math.random() * 200);
  const dailyChange = Math.floor(Math.random() * 201) - 100; // -100 to +100
  
  return {
    id: `user-${index + 1}`,
    username: usernames[index % usernames.length] + (index >= usernames.length ? `${Math.floor(index / usernames.length) + 1}` : ""),
    walletAddress: `${walletPrefixes[index % walletPrefixes.length]}${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
    reputationPoints: Math.max(0, baseRP),
    level: Math.floor(baseRP / 1000) + 1,
    dailyChange,
    avatar: avatarIcons[index % avatarIcons.length],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Generate 100 users
export const LEADERBOARD_DATA: LeaderboardUser[] = Array.from({ length: 100 }, (_, index) => 
  generateUser(index)
).sort((a, b) => b.reputationPoints - a.reputationPoints);

// Network stats calculated from data
const totalRP = LEADERBOARD_DATA.reduce((sum, user) => sum + user.reputationPoints, 0);
const activeToday = LEADERBOARD_DATA.filter(user => user.dailyChange !== 0).length;

export const NETWORK_STATS: NetworkStats = {
  totalUsers: LEADERBOARD_DATA.length,
  activeToday,
  totalRP: (totalRP / 1000000).toFixed(2) + "M",
  avgRP: (totalRP / LEADERBOARD_DATA.length).toLocaleString()
};

// Helper functions for filtering and searching
export const filterUsersByPeriod = (users: LeaderboardUser[], period: string): LeaderboardUser[] => {
  // Since we don't have real time-based data, we'll return all users for any period
  // In a real app, you'd filter based on actual timestamps
  return users;
};

export const searchUsers = (users: LeaderboardUser[], query: string): LeaderboardUser[] => {
  if (!query.trim()) return users;
  
  const searchTerm = query.toLowerCase().trim();
  return users.filter(user => 
    user.username.toLowerCase().includes(searchTerm) ||
    user.walletAddress.toLowerCase().includes(searchTerm)
  );
};

export const paginateUsers = (users: LeaderboardUser[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  return {
    users: paginatedUsers,
    totalPages: Math.ceil(users.length / limit),
    total: users.length,
    currentPage: page,
    hasNextPage: endIndex < users.length,
    hasPrevPage: page > 1
  };
};