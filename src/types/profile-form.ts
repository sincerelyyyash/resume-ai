import { z } from "zod";

export const formSchema = z.object({
  userId: z.string(),
  projects: z.array(
    z.object({
      name: z.string(),
      technologies: z.array(z.string()),
      url: z.string().url(),
      startDate: z.string(),
      endDate: z.string(),
      achievements: z.string(),
    })
  ),
  educations: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    })
  ),
  experiences: z.array(
    z.object({
      jobTitle: z.string(),
      company: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
      location: z.string(),
    })
  ),
  skills: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      level: z.string(),
      yearsOfExperience: z.string(),
    })
  ),
});

