import React from 'react';
import { Link } from 'wouter';

type InfluencerProps = {
  name: string;
  tags: string;
  platform: string;
  followers: number;
  image: string;
  id: number;
};

const CardInfluencer: React.FC<InfluencerProps> = ({ name, tags, platform, followers, image, id }) => {
  // Calculate the offset ID based on platform
  const getOffsetId = () => {
    const platformLower = platform.toLowerCase().trim();
    switch (platformLower) {
      case 'instagram':
        return id;
      case 'threads':
        return id + 1000;
      case 'tiktok':
        return id + 2000;
      case 'youtube':
        return id + 3000;
      default:
        return id;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const offsetId = getOffsetId();
  
  console.log(`Platform: ${platform}, Original ID: ${id}, Offset ID: ${offsetId}`); // Debug log

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 m-2 max-w-xs text-center flex flex-col justify-between h-full">
      <div>
        <img
          src={`https://picsum.photos/seed/${offsetId}/200`}
          alt={name}
          className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
        />
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-500">{tags}</p>
        <p className="text-gray-600 text-sm mt-2 font-medium">
          {platform} • {formatFollowers(followers)} followers
        </p>
      </div>

      <div className="mt-4">
        <Link href={`/view-profile?id=${offsetId}&platform=${encodeURIComponent(platform)}`}>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition"
          >
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CardInfluencer;