import { z } from "zod";

// Basic Info Schema
export const basicInfoSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  portfolio: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
});

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  portfolio: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  image: z.string().url().optional(),
});

// Certification Schema
export const certificationSchema = z.object({
  title: z.string().min(2).max(100),
  issuer: z.string().min(2).max(100),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  credentialUrl: z.string().url().optional(),
});

export type ProfileSchema = z.infer<typeof profileUpdateSchema>; 