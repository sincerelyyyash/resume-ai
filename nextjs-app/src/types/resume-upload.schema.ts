import { z } from "zod";


export const resumeDataSchema = z.object({
  user: z.object({
    name: z.string().min(1).optional(),
    bio: z.string().optional(),
    portfolio: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
  }).optional(),
  
  projects: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    startDate: z.string(),
    endDate: z.string().optional(),
    url: z.string().url().optional().or(z.literal("")),
    technologies: z.array(z.string()).default([]),
  })).default([]),
  
  experiences: z.array(z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    description: z.string().min(1),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    location: z.string().optional(),
  })).default([]),
  
  education: z.array(z.object({
    institution: z.string().min(1),
    degree: z.string().min(1),
    field: z.string().min(1),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
  })).default([]),
  
  skills: z.array(z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    level: z.enum(["Beginner", "Intermediate", "Expert"]).default("Intermediate"),
    yearsOfExperience: z.number().min(0).default(0),
  })).default([]),
  
  certifications: z.array(z.object({
    title: z.string().min(1),
    issuer: z.string().min(1),
    description: z.string().optional(),
    issueDate: z.string(),
    expiryDate: z.string().optional(),
    credentialUrl: z.string().url().optional().or(z.literal("")),
  })).default([]),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

// Schema for file upload validation
export const fileUploadSchema = z.object({
  file: z.any().refine((file) => {
    return file instanceof File;
  }, "Must be a file"),
}).refine((data) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  return allowedTypes.includes(data.file.type);
}, "File must be PDF or DOCX").refine((data) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return data.file.size <= maxSize;
}, "File size must be less than 5MB"); 