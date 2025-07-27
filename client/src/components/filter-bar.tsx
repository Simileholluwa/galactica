import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { FilterPeriod } from "@shared/schema";

interface FilterBarProps {
  filter: FilterPeriod;
  search: string;
  onFilterChange: (filter: FilterPeriod) => void;
  onSearchChange: (search: string) => void;
}

const filterOptions = [
  { value: "all" as const, label: "All Time" },
  { value: "week" as const, label: "This Week" },
  { value: "month" as const, label: "This Month" },
];

export default function FilterBar({
  filter,
  search,
  onFilterChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-7xl mx-auto">
        <Card className="glass-card rounded-2xl border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Filter Buttons */}
              <div className="flex flex-wrap lg:flex-block items-center gap-2 sm:gap-3 lg:justify-between">
                {filterOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filter === option.value ? "default" : "secondary"}
                    size="sm"
                    onClick={() => onFilterChange(option.value)}
                    className={
                      filter === option.value
                        ? "bg-primary hover:bg-accent text-white font-medium transition-colors"
                        : "bg-gray-100 hover:bg-gray-200 text-dark font-medium transition-colors"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-64">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search users or wallet address..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-white/70 backdrop-blur-sm border-gray-200/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
