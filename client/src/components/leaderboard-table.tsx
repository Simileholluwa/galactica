import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeaderboardUser } from "@shared/schema";

interface LeaderboardTableProps {
  data: LeaderboardUser[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
  if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-600";
  if (rank === 3) return "bg-gradient-to-r from-amber-600 to-orange-600";
  return "bg-gray-300";
};

const getAvatarGradient = (avatar: string) => {
  const gradients = {
    A: "from-primary to-accent",
    C: "from-blue-400 to-purple-500",
    S: "from-green-400 to-teal-500",
    N: "from-pink-400 to-red-500",
    Q: "from-indigo-400 to-blue-500",
    G: "from-purple-400 to-pink-500",
    V: "from-gray-500 to-gray-700",
    O: "from-orange-400 to-red-500",
  };
  return (
    gradients[avatar as keyof typeof gradients] || "from-gray-400 to-gray-600"
  );
};

const formatWalletAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatChange = (change: number) => {
  if (change > 0) {
    return {
      text: `+${change}↑`,
      className: "bg-green-100 text-green-800",
    };
  } else if (change < 0) {
    return {
      text: `${change}↓`,
      className: "bg-red-100 text-red-800",
    };
  } else {
    return {
      text: `+${change}`,
      className: "bg-yellow-100 text-yellow-800",
    };
  }
};

export default function LeaderboardTable({
  data,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
}: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <Card className="glass-card rounded-2xl border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!data.length) {
    return (
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <Card className="glass-card rounded-2xl border-primary/20">
            <CardContent className="p-12 text-center">
              <div className="text-gray-500 text-lg mb-4">No users found</div>
              <div className="text-gray-400 text-sm">
                Try adjusting your search criteria or filters
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <Card className="glass-card rounded-2xl overflow-hidden border-primary/20">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-primary/10 to-accent/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Reputation Points
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    24h Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/80 divide-y divide-gray-100/50">
                {data.map((user, index) => {
                  const rank = (currentPage - 1) * pageSize + index + 1;
                  const change = formatChange(user.dailyChange);

                  return (
                    <tr
                      key={user.id}
                      className="table-hover cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 hover:-translate-y-0.5"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankIcon(rank)} text-white font-bold text-sm`}
                          >
                            {rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-r ${getAvatarGradient(user.avatar)} flex items-center justify-center text-white font-bold`}
                          >
                            {user.avatar}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              Level {user.level}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-600">
                          {formatWalletAddress(user.walletAddress)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg font-bold gradient-text">
                            {user.reputationPoints.toLocaleString()}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">RP</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${change.className}`}
                        >
                          {change.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4 p-4">
            {data.map((user, index) => {
              const rank = (currentPage - 1) * pageSize + index + 1;
              const change = formatChange(user.dailyChange);

              return (
                <Card
                  key={user.id}
                  className="glass-card rounded-xl border-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankIcon(rank)} text-white font-bold text-sm`}
                        >
                          {rank}
                        </span>
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-r ${getAvatarGradient(user.avatar)} flex items-center justify-center text-white font-bold`}
                        >
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {user.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            Level {user.level}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${change.className}`}
                      >
                        {change.text}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-500">Wallet</div>
                        <div className="text-sm font-mono text-gray-600">
                          {formatWalletAddress(user.walletAddress)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          Reputation Points
                        </div>
                        <div className="text-lg font-bold gradient-text">
                          {user.reputationPoints.toLocaleString()}{" "}
                          <span className="text-xs text-gray-500">RP</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="p-6 border-t border-primary-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(
                  currentPage * pageSize,
                  data.length + (currentPage - 1) * pageSize,
                )}{" "}
                of {totalPages * pageSize} users
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        className="w-10 h-10 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
