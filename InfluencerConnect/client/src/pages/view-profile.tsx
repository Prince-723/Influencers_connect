import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { InfluencerProfileCSV, getInfluencerProfilesFromCSVs } from '@shared/schema';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Add new interfaces
interface Metrics {
  currentFollowers: string;
  followerGrowth: string;
  avgEngagement: string;
  totalPosts: number;
  avgLikes: string;
}

interface Trends {
  followerTrend: string;
  engagementTrend: string;
  likesPerPostTrend: string;
  commentsPerPostTrend: string;
}

const readCsvFile = async (fileName: string): Promise<any[]> => {
  try {
    const response = await fetch(`/profiledata/${fileName}`);
    const csvText = await response.text();
    const rows = csvText.split('\n').slice(1); // Skip header row
    return rows.map((row) => {
      const columns = row.split(',');
      if (columns.length < 6) return null; // Skip invalid rows
      return {
        InfluencerName: columns[0].trim(),
        Month: columns[1].trim(),
        Followers: parseInt(columns[2].trim().replace(/[^0-9]/g, ''), 10),
        AvgLikesPost: parseInt(columns[3].trim().replace(/[^0-9]/g, ''), 10),
        AvgCommentsPost: parseInt(columns[4].trim().replace(/[^0-9]/g, ''), 10),
        EngagementRate: parseFloat(columns[5].trim()),
      };
    }).filter(Boolean); // Remove null rows
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return [];
  }
};

const analyzeTrends = (data: any[]): Trends | null => {
  if (data.length < 2) return null;
  
  const latestMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  
  return {
    followerTrend: latestMonth.Followers > previousMonth.Followers ? 'increasing' : 'decreasing',
    engagementTrend: latestMonth.EngagementRate > previousMonth.EngagementRate ? 'improving' : 'declining',
    likesPerPostTrend: latestMonth.AvgLikesPost > previousMonth.AvgLikesPost ? 'growing' : 'falling',
    commentsPerPostTrend: latestMonth.AvgCommentsPost > previousMonth.AvgCommentsPost ? 'rising' : 'dropping'
  };
};

const KPICard = ({ 
  title, 
  value, 
  change, 
  icon 
}: { 
  title: string; 
  value: string | number; 
  change?: string; 
  icon?: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
      {icon && <span className="text-2xl">{icon}</span>}
    </div>
  </div>
);

const PerformanceInsights = ({ metrics, trends }: { metrics: Metrics; trends: Trends | null }) => (
  <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
    <h3 className="text-xl font-bold mb-4">Performance Insights</h3>
    <div className="space-y-4">
      <div>
        <h4 className="font-medium">Follower Growth Trend</h4>
        <p className="text-gray-600">
          {`Current following of ${metrics.currentFollowers} with ${metrics.followerGrowth} growth rate. 
          Follower count is ${trends?.followerTrend || 'stable'}.`}
        </p>
      </div>
      <div>
        <h4 className="font-medium">Engagement Analysis</h4>
        <p className="text-gray-600">
          {`Average engagement rate of ${metrics.avgEngagement} with ${metrics.avgLikes} average likes per post. 
          Engagement is ${trends?.engagementTrend || 'stable'}.`}
        </p>
      </div>
    </div>
  </div>
);

const calculateMetrics = (data: any[]) => {
  if (data.length === 0) return null;
  
  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : null;
  
  const followerGrowth = previous ? 
    ((latest.Followers - previous.Followers) / previous.Followers * 100).toFixed(1) : '0';
  
  const avgEngagement = (data.reduce((sum, item) => sum + item.EngagementRate, 0) / data.length).toFixed(2);
  
  return {
    currentFollowers: latest.Followers?.toLocaleString() || '0',
    followerGrowth: followerGrowth !== '0' ? `${parseFloat(followerGrowth) > 0 ? '+' : ''}${followerGrowth}%` : 'No data',
    avgEngagement: `${avgEngagement}%`,
    totalPosts: data.length,
    avgLikes: Math.round(data.reduce((sum, item) => sum + item.AvgLikesPost, 0) / data.length).toLocaleString(),
  };
};

const PerformanceChart = ({
  data,
  dataKey,
  name,
  color,
  formatValue,
  showInsights = true
}: {
  data: any[];
  dataKey: string;
  name: string;
  color: string;
  formatValue?: (value: any) => string;
  showInsights?: boolean;
}) => {
  const getInsightText = () => {
    if (data.length < 2) return null;
    
    const latest = data[data.length - 1];
    const first = data[0];
    const change = ((latest[dataKey] - first[dataKey]) / first[dataKey] * 100).toFixed(1);
    
    return (
      <div className="text-sm text-gray-600 mt-2">
        {`${change}% ${parseFloat(change) > 0 ? 'increase' : 'decrease'} over the period`}
      </div>
    );
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Month" />
          <YAxis tickFormatter={formatValue} />
          <Tooltip 
            formatter={(value: any) => [formatValue ? formatValue(value) : value, name]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            name={name} 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {showInsights && getInsightText()}
    </div>
  );
};

const ViewProfilePage: React.FC = () => {
  const [influencer, setInfluencer] = useState<InfluencerProfileCSV | null>(null);
  const [profiles, setProfiles] = useState<InfluencerProfileCSV[]>([]);
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [trends, setTrends] = useState<Trends | null>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  const platform = searchParams.get("platform");

  useEffect(() => {
    const loadProfilesForPlatform = async () => {
      try {
        const numericId = parseInt(id || "0");
        const platformLower = platform?.toLowerCase().trim();
        
        let baseId;
        switch (platformLower) {
          case 'instagram':
            baseId = numericId;
            break;
          case 'threads':
            baseId = numericId - 1000;
            break;
          case 'tiktok':
            baseId = numericId - 2000;
            break;
          case 'youtube':
            baseId = numericId - 3000;
            break;
          default:
            baseId = numericId;
        }

        const merged = await getInfluencerProfilesFromCSVs();
        
        const found = merged.find(profile => 
          profile.platform?.toLowerCase().trim() === platformLower && 
          profile.id === baseId
        );

        if (found) {
          const offsetId = numericId;
          setInfluencer({ ...found, id: offsetId });
        } else {
          console.log('Profile not found:', { numericId, platformLower, baseId });
        }

        setProfiles(merged);
        setLoading(false);
      } catch (error) {
        console.error('Error loading profiles:', error);
        setLoading(false);
      }
    };

    loadProfilesForPlatform();
  }, [id, platform]);

  useEffect(() => {
    const loadInfluencerPerformanceData = async () => {
      if (!influencer) return;

      const platform = searchParams.get('platform')?.toLowerCase();
      if (!platform) {
        console.error('Platform not found in URL params');
        return;
      }

      const fileName = `${platform}_Influencer_Monthly_Data_2023_2025.csv`;
      const data = await readCsvFile(fileName);
      const filteredData = data.filter(
        (entry) => entry.InfluencerName === influencer.name
      );

      setPerformanceData(filteredData);
      setTrends(analyzeTrends(filteredData));
    };

    loadInfluencerPerformanceData();
  }, [influencer, searchParams]);

  if (loading) return <div>Loading...</div>;
  
  if (!influencer) {
    return (
      <div>
        Influencer not found.<br />
        <pre style={{color:'red',fontSize:'12px',marginTop:'1em'}}>
          Debug Info: id={String(id)}, platform={platform}\nProfiles loaded: {JSON.stringify(profiles.map(p => ({id:p.id,name:p.name,platform:p.platform})))}\n
        </pre>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Influencer Profile</h1>
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={`https://picsum.photos/seed/${influencer.id}/200`}
              alt={influencer.name || "No Name"}
              className="w-40 h-40 rounded-full object-cover mb-4"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-gray-900">
              {influencer.name || <span style={{color:'red'}}>No Name</span>}
            </h2>
            <p className="text-gray-600 mt-2">
              {influencer.bio || <span style={{color:'gray'}}>No bio available.</span>}
            </p>
            <div className="mt-4">
              <h3 className="text-xl font-medium text-gray-900">
                Platform: {influencer.platform || <span style={{color:'gray'}}>Unknown</span>}
              </h3>
              <h3 className="text-xl font-medium text-gray-900">
                Location: {influencer.location || <span style={{color:'gray'}}>Unknown</span>}
              </h3>
              <h3 className="text-xl font-medium text-gray-900 mt-2">
                Tags: {Array.isArray(influencer.tags) ? influencer.tags.join(", ") : (influencer.tags || <span style={{color:'gray'}}>None</span>)}
              </h3>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Followers:</h3>
              <div className="text-gray-600">
                {influencer.followers ? (
                  <>{influencer.followers?.toLocaleString()} followers</>
                ) : (
                  <span style={{color:'gray'}}>No follower info</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {performanceData.length > 0 && (() => {
          const metrics = calculateMetrics(performanceData);
          return metrics ? (
            <>
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KPICard title="Current Followers" value={metrics.currentFollowers} icon="👥" />
                  <KPICard title="Follower Growth" value={metrics.followerGrowth} icon="📈" />
                  <KPICard title="Avg Engagement Rate" value={metrics.avgEngagement} icon="💬" />
                  <KPICard title="Avg Likes per Post" value={metrics.avgLikes} icon="❤️" />
                </div>
              </div>
              
              {trends && <PerformanceInsights metrics={metrics} trends={trends} />}
            </>
          ) : null;
        })()}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Over Time</h2>
          <div className="space-y-8">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Followers Growth</h3>
              <PerformanceChart
                data={performanceData}
                dataKey="Followers"
                name="Followers"
                color="#8884d8"
                formatValue={(value) => value?.toLocaleString() || '0'}
              />
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Rate (%)</h3>
              <PerformanceChart
                data={performanceData}
                dataKey="EngagementRate"
                name="Engagement Rate (%)"
                color="#82ca9d"
                formatValue={(value) => `${value}%`}
              />
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Average Likes per Post</h3>
              <PerformanceChart
                data={performanceData}
                dataKey="AvgLikesPost"
                name="Avg Likes/Post"
                color="#ffc658"
                formatValue={(value) => value?.toLocaleString() || '0'}
              />
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Average Comments per Post</h3>
              <PerformanceChart
                data={performanceData}
                dataKey="AvgCommentsPost"
                name="Avg Comments/Post"
                color="#ff7300"
                formatValue={(value) => value?.toLocaleString() || '0'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;