import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import CardInfluencer from "@/components/explore/cardInfluencer";
import FilterSidebar from "@/components/explore/FilterSidebar";
import { User, InfluencerProfile } from "@shared/schema";

type InfluencerWithProfile = User & { influencerProfile: InfluencerProfile };

const ExplorePage = () => {
  // Add back the filters state
  const [filters, setFilters] = useState({
    niche: "",
    tags: "",
    minFollowers: 1_000_000,
    maxFollowers: 1_000_000_000,
    location: "",
    platform: "",
  });

  const [transformedData, setTransformedData] = useState<InfluencerWithProfile[]>([]);
  const [filteredData, setFilteredData] = useState<InfluencerWithProfile[]>([]);

  // Add back the filter logic
  useEffect(() => {
    const applyFilters = () => {
      let data = [...transformedData];

      // Filter by niche
      if (filters.niche) {
        data = data.filter((inf) => {
          if (Array.isArray(inf.tags) && inf.tags.length > 0) {
            return inf.tags.some((tag) => 
              typeof tag === "string" && 
              tag.toLowerCase().includes(filters.niche.toLowerCase())
            );
          }
          return false;
        });
      }

      // Filter by tags
      if (filters.tags) {
        data = data.filter((inf) => {
          if (Array.isArray(inf.tags) && inf.tags.length > 0) {
            return inf.tags.some((tag) => 
              typeof tag === "string" && 
              tag.toLowerCase().includes(filters.tags.toLowerCase())
            );
          }
          return false;
        });
      }

      // Filter by location
      if (filters.location) {
        data = data.filter((inf) => 
          typeof inf.location === "string" && 
          inf.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Filter by follower count
      if ((typeof filters.minFollowers === "number" && filters.minFollowers > 0) || 
          (typeof filters.maxFollowers === "number" && filters.maxFollowers !== 1000000)) {
        data = data.filter((inf) => {
          let followers = 0;
          if (inf.metrics && Array.isArray(inf.metrics) && inf.metrics[0] && inf.metrics[0].value) {
            followers = parseFollowers(inf.metrics[0].value);
          } else if (inf.influencerProfile && Array.isArray(inf.influencerProfile.platforms)) {
            followers = inf.influencerProfile.platforms.reduce((sum, p) => 
              sum + parseFollowers(p.followers), 0
            );
          }
          return followers >= (filters.minFollowers || 0) && 
                 followers <= (filters.maxFollowers || 1000000);
        });
      }

      // Filter by platform
      if (filters.platform) {
        data = data.filter((inf) =>
          typeof inf.platform === "string" &&
          inf.platform.toLowerCase().trim() === filters.platform.toLowerCase().trim()
        );
      }

      setFilteredData(data);
    };

    applyFilters();
  }, [filters, transformedData]);

  const csvFiles = [
    { path: '/data/instagram_data_all-countries.csv', platform: 'Instagram', offset: 0 },
    { path: '/data/threads_data_all-countries.csv', platform: 'Threads', offset: 1000 },
    { path: '/data/tiktok_data_all-countries.csv', platform: 'TikTok', offset: 2000 },
    { path: '/data/youtube_data_all-countries.csv', platform: 'YouTube', offset: 3000 },
  ];

  const parseFile = (fileInfo: { path: string; platform: string; offset: number }): Promise<any[]> =>
    new Promise((resolve) => {
      Papa.parse(fileInfo.path, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((row: any, index) => {
            let name = 'Unknown Name';
            let handle = '';
            if (row.NAME && typeof row.NAME === 'string') {
              const parts = row.NAME.split(' @');
              name = parts[0]?.trim() || 'Unknown Name';
              handle = parts[1]?.trim() || '';
            } else if (row.NAME) {
              name = String(row.NAME).trim();
            } else if (row["INFLUENCER NAME"]) {
              name = String(row["INFLUENCER NAME"]).trim();
            }

            const baseId = index + 1;

            return {
              id: baseId,
              name,
              handle,
              profileImage: `https://picsum.photos/seed/${fileInfo.offset + baseId}/200`,
              location: row.COUNTRY || '',
              tags: row['TOPIC OF INFLUENCE']?.split(/,\s*/) || [],
              metrics: [
                {
                  label: 'Followers',
                  value: row.FOLLOWERS
                    ? row.FOLLOWERS.replace(/[^\dMK]/gi, '')
                    : '0'
                }
              ],
              platform: fileInfo.platform,
            };
          });

          resolve(data);
        }
      });
    });

  useEffect(() => {
    Promise.all(csvFiles.map(parseFile))
      .then((allDataArrays) => {
        const merged = allDataArrays.flat();
        setTransformedData(merged);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      });
  }, []);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Influencers</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4 lg:sticky top-20 self-start">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              minFollowers={1_000_000}
              maxFollowers={1_000_000_000}
            />
          </div>

          <div className="w-full lg:w-3/4">
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map((influencer) => (
                  <CardInfluencer
                    key={`${influencer.platform}-${influencer.id}`}
                    id={influencer.id}
                    name={influencer.name}
                    tags={Array.isArray(influencer.tags) ? influencer.tags.join(", ") : influencer.tags}
                    followers={parseFollowers(
                      influencer.metrics && influencer.metrics[0] && influencer.metrics[0].value
                        ? influencer.metrics[0].value
                        : 0
                    )}
                    image={influencer.profileImage}
                    platform={influencer.platform}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

// Utility function for parsing followers
const parseFollowers = (value: string | number): number => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const str = value.toString().replace(/,/g, '').trim();
  if (/m$/i.test(str)) {
    return Math.round(parseFloat(str) * 1000000);
  } else if (/k$/i.test(str)) {
    return Math.round(parseFloat(str) * 1000);
  } else {
    return parseInt(str.replace(/[^\d]/g, "")) || 0;
  }
};

export { parseFollowers };