import { Prisma } from '@prisma/client';

export type Project = Prisma.ProjectGetPayload<never>;
export type Experience = Prisma.ExperienceGetPayload<never>;
export type Skill = Prisma.SkillGetPayload<never>;
export type Education = Prisma.EducationGetPayload<never>;
export type User = Prisma.UserGetPayload<{
  include: {
    projects: true;
    experiences: true;
    skills: true;
    education: true;
    savedResumes: true;
    jobDescriptions: true;
  };
}>;

export interface UserResponse {
  status: string;
  message: string;
  data: {
    personalInfo: {
      email: string;
      name: string;
      bio?: string | null;
      linkedin?: string | null;
      github?: string | null;
      image?: string | null;
    };
    projects: Array<{
      title: string;
      description: string;
      url?: string | null;
      startDate: Date;
      endDate?: Date | null;
    }>;
    experiences: Array<{
      title: string;
      company: string;
      startDate: Date;
      endDate?: Date | null;
      description: string;
      location: string;
    }>;
    skills: Array<{
      name: string;
      category: string;
      level: string;
      yearsOfExperience: number;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      startDate: Date;
      endDate?: Date | null;
    }>;
    savedResumes: Array<{
      id: string;
      title: string;
      content: string;
      optimizedFor?: string | null;
    }>;
    jobDescriptions: Array<{
      id: string;
      title: string;
      description: string;
      requirements: string[];
      dateUploaded: Date;
    }>;
  };
}
