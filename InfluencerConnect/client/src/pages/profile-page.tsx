import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save } from "lucide-react";

// Base profile schema
const baseProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().optional(),
});

// Business profile schema
const businessProfileSchema = z.object({
  businessProfile: z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    industry: z.string().min(2, "Industry must be at least 2 characters"),
    companySize: z.string().optional(),
    website: z.string().url("Please enter a valid URL").optional().or(z.string().length(0)),
    socialLinks: z.record(z.string()).optional(),
  }),
});

// Influencer profile schema
const influencerProfileSchema = z.object({
  influencerProfile: z.object({
    niches: z.array(z.string()).min(1, "Please select at least one niche"),
    platforms: z.array(
      z.object({
        platform: z.string(),
        handle: z.string(),
        followers: z.number().int().positive(),
      })
    ).min(1, "Please add at least one platform"),
    rates: z.record(z.number().int().positive()).optional(),
    mediaKit: z.string().optional(),
  }),
});

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [platformFields, setPlatformFields] = useState<
    Array<{ platform: string; handle: string; followers: number }>
  >(
    user?.userType === "influencer" && (user as any).influencerProfile?.platforms
      ? (user as any).influencerProfile.platforms
      : [{ platform: "", handle: "", followers: 0 }]
  );

  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(
    user?.userType === "business" && (user as any).businessProfile?.socialLinks
      ? (user as any).businessProfile.socialLinks
      : { website: "", instagram: "", twitter: "", linkedin: "" }
  );

  // Create the appropriate schema based on user type
  const profileSchema =
    user?.userType === "business"
      ? baseProfileSchema.merge(businessProfileSchema)
      : baseProfileSchema.merge(influencerProfileSchema);

  // Set up form
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      profileImage: user?.profileImage || "",
      ...(user?.userType === "business"
        ? {
            businessProfile: {
              companyName: (user as any)?.businessProfile?.companyName || "",
              industry: (user as any)?.businessProfile?.industry || "",
              companySize: (user as any)?.businessProfile?.companySize || "",
              website: (user as any)?.businessProfile?.website || "",
              socialLinks: socialLinks,
            },
          }
        : {
            influencerProfile: {
              niches: (user as any)?.influencerProfile?.niches || [],
              platforms: platformFields,
              rates: (user as any)?.influencerProfile?.rates || {},
              mediaKit: (user as any)?.influencerProfile?.mediaKit || "",
            },
          }),
    },
  });

  // Handle platform fields for influencers
  const addPlatformField = () => {
    setPlatformFields([...platformFields, { platform: "", handle: "", followers: 0 }]);
    const currentPlatforms = form.getValues("influencerProfile.platforms") || [];
    form.setValue("influencerProfile.platforms", [
      ...currentPlatforms,
      { platform: "", handle: "", followers: 0 },
    ]);
  };

  const removePlatformField = (index: number) => {
    const updatedFields = [...platformFields];
    updatedFields.splice(index, 1);
    setPlatformFields(updatedFields);
    form.setValue("influencerProfile.platforms", updatedFields);
  };

  const updatePlatformField = (index: number, field: string, value: string | number) => {
    const updatedFields = [...platformFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setPlatformFields(updatedFields);
    form.setValue("influencerProfile.platforms", updatedFields);
  };

  // Handle social links for businesses
  const updateSocialLink = (network: string, value: string) => {
    const updatedLinks = { ...socialLinks, [network]: value };
    setSocialLinks(updatedLinks);
    form.setValue("businessProfile.socialLinks", updatedLinks);
  };

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      const res = await apiRequest("PATCH", "/api/profile", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate(values);
  };

  // Define available niches
  const availableNiches = [
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
    "Health",
    "Sports",
    "Art",
    "Music",
  ];

  // Define available platforms
  const availablePlatforms = [
    "Instagram",
    "YouTube",
    "TikTok",
    "Twitter",
    "LinkedIn",
    "Facebook",
    "Twitch",
    "Pinterest",
    "Snapchat",
  ];

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
          <div className="w-full md:w-1/3">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-500 text-sm capitalize">{user.userType}</p>
                  {user.bio && <p className="text-center mt-2 text-sm">{user.bio}</p>}
                  <p className="text-sm text-gray-500 mt-2">@{user.username}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-2/3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="general">General Info</TabsTrigger>
                {user.userType === "business" && (
                  <TabsTrigger value="business">Business Details</TabsTrigger>
                )}
                {user.userType === "influencer" && (
                  <TabsTrigger value="influencer">Influencer Details</TabsTrigger>
                )}
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <TabsContent value="general">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself"
                                  className="resize-none h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="profileImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {user.userType === "business" && (
                    <TabsContent value="business">
                      <Card>
                        <CardHeader>
                          <CardTitle>Business Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="businessProfile.companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="businessProfile.industry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Industry</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your company industry" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="businessProfile.companySize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Size</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. 1-10, 11-50, 51-200" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="businessProfile.website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://yourcompany.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div>
                            <h3 className="text-sm font-medium mb-2">Social Media Links</h3>
                            <div className="space-y-3">
                              {Object.entries(socialLinks).map(([network, url]) => (
                                <div key={network} className="flex items-center gap-2">
                                  <span className="w-24 text-sm capitalize">{network}:</span>
                                  <Input
                                    value={url}
                                    onChange={(e) => updateSocialLink(network, e.target.value)}
                                    placeholder={`${network} URL`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}

                  {user.userType === "influencer" && (
                    <TabsContent value="influencer">
                      <Card>
                        <CardHeader>
                          <CardTitle>Influencer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <FormLabel className="block mb-2">Niches</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {availableNiches.map((niche) => (
                                <div key={niche} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`niche-${niche}`}
                                    checked={(form.watch("influencerProfile.niches") || []).includes(
                                      niche
                                    )}
                                    onChange={(e) => {
                                      const currentNiches =
                                        form.getValues("influencerProfile.niches") || [];
                                      const updatedNiches = e.target.checked
                                        ? [...currentNiches, niche]
                                        : currentNiches.filter((n) => n !== niche);
                                      form.setValue("influencerProfile.niches", updatedNiches);
                                    }}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                  <label
                                    htmlFor={`niche-${niche}`}
                                    className="text-sm text-gray-700"
                                  >
                                    {niche}
                                  </label>
                                </div>
                              ))}
                            </div>
                            {form.formState.errors.influencerProfile?.niches && (
                              <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.influencerProfile.niches.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <FormLabel>Social Media Platforms</FormLabel>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addPlatformField}
                              >
                                Add Platform
                              </Button>
                            </div>
                            <div className="space-y-4">
                              {platformFields.map((platform, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-start">
                                  <div className="col-span-4">
                                    <select
                                      value={platform.platform}
                                      onChange={(e) =>
                                        updatePlatformField(index, "platform", e.target.value)
                                      }
                                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <option value="">Select Platform</option>
                                      {availablePlatforms.map((p) => (
                                        <option key={p} value={p}>
                                          {p}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-span-4">
                                    <Input
                                      value={platform.handle}
                                      onChange={(e) =>
                                        updatePlatformField(index, "handle", e.target.value)
                                      }
                                      placeholder="Username/Handle"
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Input
                                      type="number"
                                      value={platform.followers === 0 ? "" : platform.followers}
                                      onChange={(e) =>
                                        updatePlatformField(
                                          index,
                                          "followers",
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      placeholder="Followers"
                                    />
                                  </div>
                                  <div className="col-span-1">
                                    {platformFields.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-10 w-10"
                                        onClick={() => removePlatformField(index)}
                                      >
                                        ×
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {form.formState.errors.influencerProfile?.platforms && (
                              <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.influencerProfile.platforms.message}
                              </p>
                            )}
                          </div>

                          <FormField
                            control={form.control}
                            name="influencerProfile.mediaKit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Media Kit URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Link to your media kit (PDF, website, etc.)"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}

                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
