import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { User, InfluencerProfile } from "@shared/schema";
import { MessageSquare, User as UserIcon, Users } from "lucide-react";
import {
  Instagram,
  Youtube,
  CircleFadingPlus,
  Twitter,
  Facebook,
  Linkedin,
  Twitch,
  StarHalf,
} from "lucide-react";

type InfluencerCardProps = {
  influencer: User & { influencerProfile: InfluencerProfile };
};

const InfluencerCard = ({ influencer }: InfluencerCardProps) => {
  // Get the total followers across all platforms
  const getTotalFollowers = () => {
    if (!influencer.influencerProfile.platforms) return 0;
    
    return influencer.influencerProfile.platforms.reduce(
      (total, platform) => total + platform.followers,
      0
    );
  };

  // Format follower count (e.g. 1500 -> 1.5K, 1500000 -> 1.5M)
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "tiktok":
        return <CircleFadingPlus className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "twitch":
        return <Twitch className="h-4 w-4" />;
      case "pinterest":
        return <StarHalf className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  // Get platform color class
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "bg-pink-500";
      case "youtube":
        return "bg-red-600";
      case "tiktok":
        return "bg-black";
      case "twitter":
        return "bg-blue-400";
      case "facebook":
        return "bg-blue-600";
      case "linkedin":
        return "bg-blue-700";
      case "twitch":
        return "bg-purple-600";
      case "pinterest":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        {/* Cover/Profile section */}
        <div className="bg-gradient-to-r from-primary to-secondary h-24"></div>
        <Avatar className="absolute -bottom-6 left-4 h-16 w-16 border-4 border-white">
          <AvatarImage src={influencer.profileImage} alt={influencer.name} />
          <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      <CardContent className="pt-8 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg mb-1">{influencer.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{influencer.location || "No location"}</p>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm font-medium">{formatFollowers(getTotalFollowers())}</span>
          </div>
        </div>

        {/* Niches */}
        <div className="flex flex-wrap gap-1 my-3">
          {influencer.influencerProfile.niches?.slice(0, 3).map((niche, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {niche}
            </Badge>
          ))}
          {(influencer.influencerProfile.niches?.length || 0) > 3 && (
            <Badge variant="outline" className="text-xs">
              +{(influencer.influencerProfile.niches?.length || 0) - 3} more
            </Badge>
          )}
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{influencer.bio || "No bio"}</p>

        {/* Platforms */}
        <div className="flex flex-wrap gap-1 mt-2">
          {influencer.influencerProfile.platforms?.map((platform, index) => (
            <div
              key={index}
              className={`${getPlatformColor(
                platform.platform
              )} text-white text-xs px-2 py-1 rounded-full flex items-center`}
            >
              {getPlatformIcon(platform.platform)}
              <span className="ml-1">{formatFollowers(platform.followers)}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/messages/${influencer.id}`}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/influencer/${influencer.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InfluencerCard;