import { z } from "zod";

// Project Schema
export const projectSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  technologies: z.array(z.string()),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  url: z.string().url().optional(),
});

// Experience Schema
export const experienceSchema = z.object({
  company: z.string().min(2).max(100),
  title: z.string().min(2).max(100),
  location: z.string().max(100).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  description: z.string().min(10).max(1000),
  responsibilities: z.array(z.string()),
});

// Education Schema
export const educationSchema = z.object({
  institution: z.string().min(2).max(100),
  degree: z.string().min(2).max(100),
  field: z.string().min(2).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  gpa: z.number().min(0).max(4).optional(),
  location: z.string().max(100).optional(),
});

// Skill Schema
export const skillSchema = z.object({
  name: z.string().min(2).max(50),
  level: z.enum(['Beginner', 'Intermediate', 'Expert']),
  yearsOfExperience: z.number().min(0).max(50).optional(),
});

// Form Submission Schema
export const formSchema = z.object({
  userId: z.string(),
  projects: z.array(projectSchema),
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
});

