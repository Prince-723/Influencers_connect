import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  DollarSign,
  MessageSquare,
  Eye,
  Check,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Campaign, Collaboration, User } from "@shared/schema";

const InfluencerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Query campaigns (available opportunities)
  const {
    data: campaigns,
    isLoading: loadingCampaigns,
    error: campaignsError,
  } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  // Query collaborations (requests received)
  const {
    data: collaborations,
    isLoading: loadingCollaborations,
    error: collaborationsError,
  } = useQuery<(Collaboration & { business?: User, campaign?: Campaign })[]>({
    queryKey: ["/api/collaborations"],
  });

  // Accept/reject collaboration mutation
  const updateCollaborationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/collaborations/${id}`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collaborations"] });
      toast({
        title: "Collaboration updated",
        description: "The collaboration status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update collaboration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle collaboration status update
  const handleCollaborationUpdate = (id: number, status: string) => {
    updateCollaborationMutation.mutate({ id, status });
  };

  // Mock data for charts
  const mockEarningsData = [
    { month: "Jan", earnings: 1200 },
    { month: "Feb", earnings: 1800 },
    { month: "Mar", earnings: 1500 },
    { month: "Apr", earnings: 2200 },
    { month: "May", earnings: 2800 },
    { month: "Jun", earnings: 3200 },
  ];

  const mockPerformanceData = [
    { platform: "Instagram", engagement: 5.2, followers: 25000 },
    { platform: "TikTok", engagement: 7.8, followers: 42000 },
    { platform: "YouTube", engagement: 4.3, followers: 15000 },
    { platform: "Twitter", engagement: 3.1, followers: 8500 },
  ];

  const mockImpressionsData = [
    { day: "Mon", impressions: 1200 },
    { day: "Tue", impressions: 1800 },
    { day: "Wed", impressions: 2400 },
    { day: "Thu", impressions: 1900 },
    { day: "Fri", impressions: 2600 },
    { day: "Sat", impressions: 3100 },
    { day: "Sun", impressions: 2200 },
  ];

  // Function to get the total earnings
  const getTotalEarnings = () => {
    return mockEarningsData.reduce((sum, item) => sum + item.earnings, 0);
  };

  // Function to get pending collaborations
  const getPendingCollaborations = () => {
    return collaborations?.filter(collab => collab.status === "pending").length || 0;
  };

  // Function to get completed collaborations
  const getCompletedCollaborations = () => {
    return collaborations?.filter(collab => collab.status === "completed").length || 0;
  };

  return (
    <div className="space-y-6">
      {/* Top stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <h3 className="text-2xl font-bold">${getTotalEarnings()}</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <h3 className="text-2xl font-bold">{getPendingCollaborations()}</h3>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Collabs</p>
                <h3 className="text-2xl font-bold">{getCompletedCollaborations()}</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Check className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="requests">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="requests">Collaboration Requests</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Collaboration Requests Tab */}
        <TabsContent value="requests">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Collaboration Requests</h2>
            </div>

            {loadingCollaborations ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : collaborationsError ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                An error occurred while loading collaboration requests. Please try again.
              </div>
            ) : collaborations && collaborations.length > 0 ? (
              <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collaborations.map((collab) => (
                      <TableRow key={collab.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={collab.business?.profileImage} />
                              <AvatarFallback>
                                {collab.business?.name.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{collab.business?.name || "Unknown"}</p>
                              <p className="text-xs text-gray-500">
                                @{collab.business?.username || "unknown"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{collab.campaign?.title || "Direct Request"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              collab.status === "accepted"
                                ? "default"
                                : collab.status === "rejected"
                                ? "destructive"
                                : collab.status === "completed"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {collab.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(collab.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {collab.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                                  onClick={() => handleCollaborationUpdate(collab.id, "accepted")}
                                  disabled={updateCollaborationMutation.isPending}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                                  onClick={() => handleCollaborationUpdate(collab.id, "rejected")}
                                  disabled={updateCollaborationMutation.isPending}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/messages/${collab.businessId}`}>
                                <MessageSquare className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No collaboration requests yet</h3>
                <p className="text-gray-500 mb-4">
                  Complete your profile to attract collaboration requests from businesses.
                </p>
                <Button asChild>
                  <Link href="/profile">Update Your Profile</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Available Opportunities</h2>

            {loadingCampaigns ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : campaignsError ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                An error occurred while loading opportunities. Please try again.
              </div>
            ) : campaigns && campaigns.filter(c => c.status === "active").length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns
                  .filter(campaign => campaign.status === "active")
                  .map((campaign) => (
                    <Card key={campaign.id}>
                      <CardHeader>
                        <CardTitle>{campaign.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            {campaign.description.length > 100
                              ? `${campaign.description.substring(0, 100)}...`
                              : campaign.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge>Budget: ${campaign.budget}</Badge>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/campaign/${campaign.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active opportunities</h3>
                <p className="text-gray-500 mb-4">
                  Check back later for new opportunities or reach out to businesses directly.
                </p>
                <Button asChild>
                  <Link href="/explore">Browse Businesses</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-8">
            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockEarningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Earnings"]} />
                      <Bar dataKey="earnings" fill="#3b82f6" name="Earnings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="engagement" name="Engagement Rate (%)" fill="#3b82f6" />
                      <Bar yAxisId="right" dataKey="followers" name="Followers" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Impressions Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Impressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockImpressionsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="impressions"
                        stroke="#8b5cf6"
                        activeDot={{ r: 8 }}
                        name="Impressions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Media Kit Section */}
            {user && (user as any).influencerProfile?.mediaKit && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Media Kit</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <a href={(user as any).influencerProfile.mediaKit} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Share your media kit with potential collaborators to showcase your work and audience.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfluencerDashboard;
