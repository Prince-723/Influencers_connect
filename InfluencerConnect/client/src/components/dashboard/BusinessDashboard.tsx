import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart2,
  Plus,
  MessageSquare,
  Users,
  Check,
  X,
  Loader2,
  Settings,
} from "lucide-react";
import { Campaign, Collaboration, User } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Campaign form schema
const campaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.number().min(1, "Budget must be at least 1"),
  requirements: z.string().optional(),
  status: z.enum(["draft", "active", "completed"]),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const BusinessDashboard = () => {
  const { toast } = useToast();
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  // Form for creating new campaigns
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
      requirements: "",
      status: "draft",
    },
  });

  // Query campaigns
  const {
    data: campaigns,
    isLoading: loadingCampaigns,
    error: campaignsError,
  } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  // Query collaborations
  const {
    data: collaborations,
    isLoading: loadingCollaborations,
    error: collaborationsError,
  } = useQuery<(Collaboration & { influencer?: User })[]>({
    queryKey: ["/api/collaborations"],
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormValues) => {
      const res = await apiRequest("POST", "/api/campaigns", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully.",
      });
      setIsCreateCampaignOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update collaboration status mutation
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

  // Submit handler for creating new campaign
  const onSubmit = (data: CampaignFormValues) => {
    createCampaignMutation.mutate(data);
  };

  // Handle collaboration status update
  const handleCollaborationUpdate = (id: number, status: string) => {
    updateCollaborationMutation.mutate({ id, status });
  };

  // Mock data for charts
  const campaignStatusData = [
    { name: "Active", value: campaigns?.filter((c) => c.status === "active").length || 0 },
    { name: "Draft", value: campaigns?.filter((c) => c.status === "draft").length || 0 },
    { name: "Completed", value: campaigns?.filter((c) => c.status === "completed").length || 0 },
  ];

  const collaborationStatusData = [
    { name: "Pending", value: collaborations?.filter((c) => c.status === "pending").length || 0 },
    { name: "Accepted", value: collaborations?.filter((c) => c.status === "accepted").length || 0 },
    { name: "Rejected", value: collaborations?.filter((c) => c.status === "rejected").length || 0 },
    { name: "Completed", value: collaborations?.filter((c) => c.status === "completed").length || 0 },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#f97316", "#10b981"];

  // Simulated ROI and engagement metrics
  const performanceData = [
    { name: "Campaign 1", roi: 250, engagement: 85 },
    { name: "Campaign 2", roi: 175, engagement: 65 },
    { name: "Campaign 3", roi: 310, engagement: 92 },
    { name: "Campaign 4", roi: 220, engagement: 78 },
  ];

  return (
    <div className="space-y-6">
      {/* Top stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                <h3 className="text-2xl font-bold">{campaigns?.filter((c) => c.status === "active").length || 0}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Collaborations</p>
                <h3 className="text-2xl font-bold">{collaborations?.filter((c) => c.status === "pending").length || 0}</h3>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unread Messages</p>
                <h3 className="text-2xl font-bold">5</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="campaigns">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Campaigns</h2>
              <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to create a new influencer marketing campaign.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Summer Collection Promotion" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your campaign goals and expectations"
                                className="resize-none h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Budget in USD"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <select
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  {...field}
                                >
                                  <option value="draft">Draft</option>
                                  <option value="active">Active</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requirements (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Specific requirements for influencers"
                                className="resize-none h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button 
                          type="submit" 
                          disabled={createCampaignMutation.isPending}
                        >
                          {createCampaignMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                            </>
                          ) : (
                            "Create Campaign"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {loadingCampaigns ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : campaignsError ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                An error occurred while loading campaigns. Please try again.
              </div>
            ) : campaigns && campaigns.length > 0 ? (
              <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.title}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              campaign.status === "active"
                                ? "default"
                                : campaign.status === "completed"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${campaign.budget}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/campaign/${campaign.id}`}>View</Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/campaign/${campaign.id}/edit`}>
                                <Settings className="h-4 w-4" />
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-500 mb-4">
                  Create your first campaign to start finding influencers for your brand.
                </p>
                <Button onClick={() => setIsCreateCampaignOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Collaborations Tab */}
        <TabsContent value="collaborations">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Collaboration Requests</h2>

            {loadingCollaborations ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : collaborationsError ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                An error occurred while loading collaborations. Please try again.
              </div>
            ) : collaborations && collaborations.length > 0 ? (
              <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influencer</TableHead>
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
                              <AvatarImage src={collab.influencer?.profileImage} />
                              <AvatarFallback>
                                {collab.influencer?.name.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{collab.influencer?.name || "Unknown"}</p>
                              <p className="text-xs text-gray-500">
                                @{collab.influencer?.username || "unknown"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{campaigns?.find(c => c.id === collab.campaignId)?.title || "Direct Request"}</TableCell>
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
                              <Link href={`/messages/${collab.influencerId}`}>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No collaborations yet</h3>
                <p className="text-gray-500 mb-4">
                  Start creating campaigns or reach out to influencers directly.
                </p>
                <Button asChild>
                  <Link href="/explore">
                    <Users className="h-4 w-4 mr-2" />
                    Find Influencers
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={campaignStatusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {campaignStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collaboration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={collaborationStatusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {collaborationStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="roi" name="ROI (%)" fill="#3b82f6" />
                      <Bar dataKey="engagement" name="Engagement Rate (%)" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessDashboard;
