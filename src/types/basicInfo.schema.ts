import { z } from "zod";

export const basicInfoSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .nullable(),
  portfolio: z.string()
    .url("Portfolio must be a valid URL")
    .optional()
    .nullable(),
  linkedin: z.string()
    .url("LinkedIn must be a valid URL")
    .optional()
    .nullable(),
  github: z.string()
    .url("GitHub must be a valid URL")
    .optional()
    .nullable(),
  image: z.string()
    .url("Image must be a valid URL")
    .optional()
    .nullable(),
});

export type BasicInfo = z.infer<typeof basicInfoSchema>; 