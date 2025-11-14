import { z } from "zod";

export const communityPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  posterUrl: z.string().optional(),
  location: z.string().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  tag: z
    .enum([
      "music",
      "sports",
      "education",
      "tech",
      "business",
      "art",
      "food",
      "culture",
      "charity",
      "entertainment",
      "health",
      "community",
    ])
    .optional(),
});

export type CommunityPostFormInput = z.infer<typeof communityPostSchema>;
