import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

type FilterSidebarProps = {
  filters: {
    niche: string;
    platform: string;
    minFollowers: number;
    maxFollowers: number;
    location: string;
  };
  onFilterChange: (filters: Partial<FilterSidebarProps["filters"]>) => void;
  minFollowers: number;
  maxFollowers: number;
};

const FilterSidebar = ({ filters, onFilterChange, minFollowers, maxFollowers }: FilterSidebarProps) => {
  // Define available niches
  const niches = [
    "Fashion",
    "Beauty",
    "Fitness",
    "Technology",
    "Gaming",
    "Food",
    "Travel",
    "Lifestyle",
    "Business",
    "Finance",
    "Education",
    "Entertainment",
    "Sports",
    "Music"
  ];

  // Define available platforms
  const platforms = [
    "Instagram",
    "YouTube",
    "TikTok",
    "Threads",
    "LinkedIn",
    "Facebook",
    "Twitch",
  ];

  // Format follower count for display
  const formatFollowerCount = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  // Reset filters
  const resetFilters = () => {
    onFilterChange({
      niche: "",
      platform: "",
      minFollowers: 0,
      maxFollowers: 1000000,
      location: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location filter */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            placeholder="City, Country"
            className="mt-1"
          />
        </div>

        {/* Niche filter */}
        <div>
          <Label className="block mb-2">Niche</Label>
          <div className="flex flex-wrap gap-2">
            {niches.map((niche) => (
              <Badge
                key={niche}
                variant={filters.niche === niche ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onFilterChange({ niche: filters.niche === niche ? "" : niche })}
              >
                {niche}
              </Badge>
            ))}
          </div>
        </div>

        {/* Platform filter */}
        <div>
          <Label className="block mb-2">Platform</Label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <Badge
                key={platform}
                variant={filters.platform === platform ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() =>
                  onFilterChange({ platform: filters.platform === platform ? "" : platform })
                }
              >
                {platform}
              </Badge>
            ))}
          </div>
        </div>

        {/* Followers range filter */}
        <div>
          <Label className="block mb-2">Followers</Label>
          <div className="pb-4 pl-0 pr-0">
            <Slider
              className="my-2 h-3 w-full"
              value={[filters.minFollowers, filters.maxFollowers]}
              min={minFollowers}
              max={maxFollowers}
              step={1000}
              onValueChange={(value) => {
                if (Array.isArray(value) && value.length === 2) {
                  onFilterChange({
                    minFollowers: value[0],
                    maxFollowers: value[1],
                  });
                }
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatFollowerCount(filters.minFollowers)}</span>
              <span>{formatFollowerCount(filters.maxFollowers)}</span>
            </div>
          </div>
        </div>

        {/* Apply Filters button for mobile */}
        <div className="md:hidden">
          <Button className="w-full">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
