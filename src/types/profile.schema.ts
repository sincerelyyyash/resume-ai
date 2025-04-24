import { z } from "zod";

export const profileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters long")
    .optional(),
  
  bio: z.string()
    .max(500, "Bio must be less than 500 characters long")
    .optional(),
  
  portfolio: z.string()
    .url("Portfolio must be a valid URL")
    .optional(),
  
  linkedin: z.string()
    .url("LinkedIn must be a valid URL")
    .optional(),
  
  github: z.string()
    .url("GitHub must be a valid URL")
    .optional(),
  
  image: z.string()
    .url("Image must be a valid URL")
    .optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>; 