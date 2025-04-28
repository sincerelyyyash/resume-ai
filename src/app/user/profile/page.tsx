"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

import ProjectSection from "@/components/profile/ProjectSection";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import ExperienceSection from "@/components/profile/ExperienceSection";
import SkillsSection from "@/components/profile/SkillsSection";
import EducationSection from "@/components/profile/EducationSection";

interface UserData {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  image: string | null;
  projects: any[];
  experiences: any[];
  education: any[];
  skills: any[];
}

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/user/get-user");
        
        if (res.data?.success && res.data.data) {
          setUserData(res.data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch user data.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching user data.",
          variant: "destructive",
        });
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user?.id, toast]);

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col mt-10 space-y-10 pb-20 max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-32 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
          Please sign in to view your profile
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          You need to be logged in to access this page.
        </p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
          No profile data found
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Please complete your profile to see your information here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-10 space-y-10 pb-20 max-w-6xl">
      <UserProfileHeader
        name={userData.name}
        email={userData.email}
        bio={userData.bio}
        linkedin={userData.linkedin}
        github={userData.github}
        portfolio={userData.portfolio}
        image={userData.image}
      />

      <ProjectSection
        projects={(userData.projects || []).map((p: any, idx: number) => ({
          id: String(idx),
          title: p.name,
          technologies: p.technologies,
          description: p.achievements,
          start_date: p.startDate,
          end_date: p.endDate,
          project_url: p.url,
        }))}
        showEdit={true}
        showAddNew={true}
        onSave={(project, isEdit) => {
          toast({
            title: isEdit ? "Project Updated" : "Project Added",
            description: `${project.title} was ${isEdit ? "updated" : "added"} successfully.`,
          });
        }}
        onDelete={(id) => {
          toast({
            title: "Project Deleted",
            description: `Project with id ${id} was deleted.`,
          });
        }}
      />

      <ExperienceSection
        experiences={(userData.experiences || []).map((exp: any, idx: number) => ({
          id: String(idx),
          title: exp.jobTitle,
          company: exp.company,
          description: exp.description,
          location: exp.location,
          start_date: exp.startDate,
          end_date: exp.endDate,
        }))}
        showEdit={true}
        showAddNew={true}
        onSave={(experience, isEdit) => {
          toast({
            title: isEdit ? "Experience Updated" : "Experience Added",
            description: `${experience.title} was ${isEdit ? "updated" : "added"} successfully.`,
          });
        }}
        onDelete={(id) => {
          toast({
            title: "Experience Deleted",
            description: `Experience with id ${id} was deleted.`,
          });
        }}
      />

      <SkillsSection
        skills={(userData.skills || []).map((skill: any, idx: number) => ({
          id: String(idx),
          name: skill.name,
          category: skill.category,
          level: skill.level,
          yearsOfExperience: skill.yearsOfExperience,
        }))}
        showEdit={true}
        showAddNew={true}
        onSave={(skill, isEdit) => {
          toast({
            title: isEdit ? "Skill Updated" : "Skill Added",
            description: `${skill.name} was ${isEdit ? "updated" : "added"} successfully.`,
          });
        }}
        onDelete={(id) => {
          toast({
            title: "Skill Deleted",
            description: `Skill with id ${id} was deleted.`,
          });
        }}
      />

      <EducationSection
        education={(userData.education || []).map((edu: any, idx: number) => ({
          id: String(idx),
          institution: edu.institution,
          degree: edu.degree,
          start_date: edu.startDate,
          end_date: edu.endDate,
        }))}
        showEdit={true}
        showAddNew={true}
        onSave={(education, isEdit) => {
          toast({
            title: isEdit ? "Education Updated" : "Education Added",
            description: `${education.degree} was ${isEdit ? "updated" : "added"} successfully.`,
          });
        }}
        onDelete={(id) => {
          toast({
            title: "Education Deleted",
            description: `Education with id ${id} was deleted.`,
          });
        }}
      />
    </div>
  );
}

