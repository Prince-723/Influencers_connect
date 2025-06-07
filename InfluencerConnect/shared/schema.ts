// import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod";

// // User table with discriminator for user type
// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   username: text("username").notNull().unique(),
//   password: text("password").notNull(),
//   email: text("email").notNull().unique(),
//   name: text("name").notNull(),
//   userType: text("user_type", { enum: ["business", "influencer"] }).notNull(),
//   bio: text("bio"),
//   location: text("location"),
//   profileImage: text("profile_image"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// // Business profiles
// export const businessProfiles = pgTable("business_profiles", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id").notNull().references(() => users.id),
//   companyName: text("company_name").notNull(),
//   industry: text("industry").notNull(),
//   companySize: text("company_size"),
//   website: text("website"),
//   socialLinks: json("social_links").$type<Record<string, string>>(),
// });

// // Influencer profiles
// export const influencerProfiles = pgTable("influencer_profiles", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id").notNull().references(() => users.id),
//   niches: json("niches").$type<string[]>(),
//   platforms: json("platforms").$type<Array<{platform: string, handle: string, followers: number}>>(),
//   rates: json("rates").$type<Record<string, number>>(),
//   mediaKit: text("media_kit"),
// });

// // Campaign/promotion requests
// export const campaigns = pgTable("campaigns", {
//   id: serial("id").primaryKey(),
//   businessId: integer("business_id").notNull().references(() => users.id),
//   title: text("title").notNull(),
//   description: text("description").notNull(),
//   budget: integer("budget"),
//   requirements: text("requirements"),
//   status: text("status", { enum: ["draft", "active", "completed"] }).notNull().default("draft"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// // Collaboration requests
// export const collaborations = pgTable("collaborations", {
//   id: serial("id").primaryKey(),
//   campaignId: integer("campaign_id").references(() => campaigns.id),
//   businessId: integer("business_id").notNull().references(() => users.id),
//   influencerId: integer("influencer_id").notNull().references(() => users.id),
//   status: text("status", { enum: ["pending", "accepted", "rejected", "completed"] }).notNull().default("pending"),
//   message: text("message"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// // Messages
// export const messages = pgTable("messages", {
//   id: serial("id").primaryKey(),
//   senderId: integer("sender_id").notNull().references(() => users.id),
//   receiverId: integer("receiver_id").notNull().references(() => users.id),
//   content: text("content").notNull(),
//   read: boolean("read").notNull().default(false),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// // Schemas for data validation and insertion
// export const insertUserSchema = createInsertSchema(users).omit({
//   id: true,
//   createdAt: true
// });

// export const insertBusinessProfileSchema = createInsertSchema(businessProfiles).omit({
//   id: true
// });

// export const insertInfluencerProfileSchema = createInsertSchema(influencerProfiles).omit({
//   id: true
// });

// export const insertCampaignSchema = createInsertSchema(campaigns).omit({
//   id: true,
//   createdAt: true
// });

// export const insertCollaborationSchema = createInsertSchema(collaborations).omit({
//   id: true,
//   createdAt: true
// });

// export const insertMessageSchema = createInsertSchema(messages).omit({
//   id: true,
//   createdAt: true
// });

// // Types
// export type InsertUser = z.infer<typeof insertUserSchema>;
// export type InsertBusinessProfile = z.infer<typeof insertBusinessProfileSchema>;
// export type InsertInfluencerProfile = z.infer<typeof insertInfluencerProfileSchema>;
// export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
// export type InsertCollaboration = z.infer<typeof insertCollaborationSchema>;
// export type InsertMessage = z.infer<typeof insertMessageSchema>;

// export type User = typeof users.$inferSelect;
// export type BusinessProfile = typeof businessProfiles.$inferSelect;
// export type InfluencerProfile = typeof influencerProfiles.$inferSelect;
// export type Campaign = typeof campaigns.$inferSelect;
// export type Collaboration = typeof collaborations.$inferSelect;
// export type Message = typeof messages.$inferSelect;

// // Extended user types
// export type BusinessUser = User & { businessProfile?: BusinessProfile };
// export type InfluencerUser = User & { influencerProfile?: InfluencerProfile };

// // Login schema
// export const loginSchema = z.object({
//   username: z.string().min(3, "Username must be at least 3 characters"),
//   password: z.string().min(6, "Password must be at least 6 characters")
// });

// export type LoginData = z.infer<typeof loginSchema>;

// This module will provide utilities for loading and parsing user profiles from CSV files instead of using Drizzle ORM or Zod schemas.

import Papa from "papaparse";

// Type for influencer profile loaded from CSV
export type InfluencerProfileCSV = {
  id: number; // <-- Add this line
  name: string;
  handle?: string;
  platform: string;
  followers: number;
  location?: string;
  tags?: string[];
  profileImage?: string;
  bio?: string;
};

// Loads and parses influencer profiles from multiple CSV files
async function getInfluencerProfilesFromCSVs(): Promise<InfluencerProfileCSV[]> {
  const csvFiles = [
    "/data/instagram_data_all-countries.csv",
    "/data/threads_data_all-countries.csv",
    "/data/tiktok_data_all-countries.csv",
    "/data/youtube_data_all-countries.csv",
  ];

  // Helper to fetch and parse a CSV file
  const parseCSV = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      fetch(filePath)
        .then((res) => {
          if (!res.ok) {
            console.error(`Failed to fetch ${filePath}: ${res.status} ${res.statusText}`);
            reject(new Error(`Failed to fetch ${filePath}: ${res.status} ${res.statusText}`));
            return;
          }
          return res.text();
        })
        .then((csvText) => {
          if (!csvText) return;
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (err) => {
              console.error(`PapaParse error for ${filePath}:`, err);
              reject(err);
            },
          });
        })
        .catch((err) => {
          console.error(`Error fetching/parsing ${filePath}:`, err);
          reject(err);
        });
    });
  };

  // Utility to parse followers string like '1.2M', '800K', '1234' to number
  const parseFollowers = (value: string | number): number => {
    if (typeof value === "number") return value;
    const str = String(value).trim();
    if (str.endsWith("M")) return Math.round(parseFloat(str) * 1000000);
    if (str.endsWith("K")) return Math.round(parseFloat(str) * 1000);
    return parseInt(str.replace(/[^\d]/g, "")) || 0;
  };

  let allDataArrays: any[][] = [];
  try {
    allDataArrays = await Promise.all(csvFiles.map(parseCSV));
  } catch (err) {
    console.error("Error loading CSV files:", err);
    return [];
  }
  const influencerProfiles: InfluencerProfileCSV[] = [];

  allDataArrays.forEach((dataArray, fileIdx) => {
    dataArray.forEach((row: any, index: number) => {
      let name = row["NAME"] || row["INFLUENCER NAME"] || row["Creator Name"] || row["creator_name"] || "";
      name = String(name).trim();
      if (!name) return;
      const handle = row["HANDLE"] || row["USERNAME"] || row["creator_username"] || row["Creator Username"] || undefined;
      const platform = csvFiles[fileIdx].split("_")[0].replace("/data/", "");
      const followers = parseFollowers(row["FOLLOWERS"] || row["Followers"] || row["followers"] || row["Followers Count"]);
      const location = row["COUNTRY"] || row["Location"] || row["country"] || undefined;
      const tags = (row["TAGS"] || row["NICHES"] || row["niches"] ||row['TOPIC OF INFLUENCE']|| "").split(",").map((t: string) => t.trim()).filter(Boolean);
      const profileImage = row["PROFILE PIC"] || row["Profile Pic"] || row["profile_pic"] || undefined;
      const bio = row["BIO"] || row["bio"] || undefined;
      influencerProfiles.push({
        id: Number(row.id) || index + 1, // Ensure id is a number and fallback to index if missing
        name,
        handle,
        platform,
        followers,
        location,
        tags,
        profileImage,
        bio,
      });
    });
  });
  return influencerProfiles;
}

export { getInfluencerProfilesFromCSVs };