import { z } from 'zod';
import { projectSchema, experienceSchema, educationSchema, skillSchema } from './form.schema';
import { certificationSchema } from './profile.schema';

// Resume Generation Schema
export const resumeGenerationSchema = z.object({
  jobDescription: z.string().min(10).max(5000),
  userData: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    projects: z.array(projectSchema),
    experiences: z.array(experienceSchema),
    education: z.array(educationSchema),
    skills: z.array(skillSchema),
    certifications: z.array(certificationSchema).optional(),
  }),
});

// Resume Analysis Schema
export const resumeAnalysisSchema = z.object({
  jobDescription: z.string().min(10).max(5000),
  resume: z.string().min(10),
});

// Resume Optimization Schema
export const resumeOptimizationSchema = z.object({
  jobDescription: z.string().min(10).max(5000),
  resume: z.string().min(10),
  optimizationType: z.enum(['content', 'format', 'both']),
}); 