import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import StardustBackground from "../components/stardust-background";
import LeaderboardTable from "../components/leaderboard-table";
import FilterBar from "../components/filter-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import galaxyIconPath from "@assets/Icon_White star_1753623198133.png";
import { LEADERBOARD_DATA, NETWORK_STATS, filterUsersByPeriod, searchUsers, paginateUsers } from "../data/leaderboard-data";
import type { FilterPeriod } from "@shared/schema";

export default function Leaderboard() {
  const [filter, setFilter] = useState<FilterPeriod>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Process local data instead of API calls
  const leaderboardResponse = useMemo(() => {
    let filteredUsers = filterUsersByPeriod(LEADERBOARD_DATA, filter);
    filteredUsers = searchUsers(filteredUsers, search);
    return paginateUsers(filteredUsers, currentPage, pageSize);
  }, [filter, search, currentPage, pageSize]);

  const leaderboardData = leaderboardResponse.users;
  const totalPages = leaderboardResponse.totalPages;
  const total = leaderboardResponse.total;
  const isLoading = false; // No loading state needed for local data

  // Reset to page 1 when filter or search changes
  const handleFilterChange = (newFilter: FilterPeriod) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  // Use local stats data
  const stats = NETWORK_STATS;

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <StardustBackground />

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Galactica Logo */}
            <a href="https://galactica.com/" target="_blank">
              {" "}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-full overflow-hidden">
                  <img
                    src={galaxyIconPath}
                    alt="Galactica Network Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-dark">
                    Galactica Network
                  </h1>
                  <p className="text-sm text-gray-600">Reputation System</p>
                </div>
              </div>
            </a>

            {/* Network Status Indicator */}
            <a href="https://explorer-reticulum.galactica.com/" target="_blank">
              <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-dark font-medium">
                  Network Active
                </span>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto text-center">
          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-4">
            Galactica Reputation Leaderboard
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track the most active and trusted members of the Galactica Network
            ecosystem
          </p>

          {/* Floating CTA Button */}
          <a href="https://app.galactica.com/" target="_blank">
            {" "}
            <div className="mb-8">
              <Button className="glass-card px-8 py-6 text-md rounded-full font-bold text-dark hover:scale-105 transition-all duration-300 border-primary inline-flex items-center space-x-2 bg-transparent hover:bg-transparent">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span>Start building your reputation</span>
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              </Button>
            </div>
          </a>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        filter={filter}
        search={search}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />

      {/* Leaderboard Table */}
      <LeaderboardTable
        data={leaderboardData}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
      />

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <Card className="glass-card rounded-2xl border-primary/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-dark mb-4">
                    About Reputation Points
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Reputation Points (RP) are earned through active
                    participation, quality contributions, and community
                    engagement within the Galactica Network ecosystem.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark mb-4">
                    How to Earn RP
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• Complete tasks</li>
                    <li>• Participate in competitions</li>
                    <li>• Get active on Discord</li>
                    <li>• Mentor new users</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark mb-4">
                    Network Stats
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Users:</span>
                      <span className="font-semibold text-dark">
                        {stats?.totalUsers || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Today:</span>
                      <span className="font-semibold text-dark">
                        {stats?.activeToday || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Total RP Distributed:
                      </span>
                      <span className="font-semibold gradient-text">
                        {stats?.totalRP || "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                    © 2025 Galactica Network. Privacy for all.
                  </p>
                  <div className="flex items-center space-x-4">
                    <a
                      href="https://galactica.com/research/galactica_white_paper.pdf"
                      target="_blank"
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      Whitepaper
                    </a>
                    <a
                      href="https://galactica.com/news"
                      target="_blank"
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      Newsroom
                    </a>
                    <a
                      href="https://galactica.com/team"
                      target="_blank"
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      Team
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
  );
}
