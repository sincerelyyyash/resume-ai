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
import CertificationSection from "@/components/profile/CertificationSection";

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
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;
    description?: string;
    gpa?: string;
  }[];
  skills: any[];
  certifications: {
    id: string;
    title: string;
    issuer: string;
    description?: string;
    issueDate: string;
    expiryDate?: string;
    credentialUrl?: string;
  }[];
}

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  useEffect(() => {
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
      <div className="flex flex-col items-center justify-center mt-10 space-y-4 h-screen">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
          Please sign in to view your profile
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          You need to be logged in to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-10 space-y-10 pb-20 max-w-6xl">
      {userData && (
        <UserProfileHeader
          userData={userData}
          onSave={fetchUserData}
        />
      )}

      <ProjectSection
        projects={userData?.projects || []}
        showEdit={true}
        showAddNew={true}
        onSave={fetchUserData}
        onDelete={fetchUserData}
      />

      <ExperienceSection
        experiences={userData?.experiences || []}
        showEdit={true}
        showAddNew={true}
        onSave={fetchUserData}
        onDelete={fetchUserData}
      />

      <EducationSection
        education={userData?.education || []}
        showEdit={true}
        showAddNew={true}
        onSave={fetchUserData}
        onDelete={fetchUserData}
      />

      <SkillsSection
        skills={userData?.skills || []}
        showEdit={true}
        showAddNew={true}
        onSave={fetchUserData}
        onDelete={fetchUserData}
      />

      <CertificationSection
        certifications={userData?.certifications || []}
        showEdit={true}
        showAddNew={true}
        onSave={fetchUserData}
        onDelete={fetchUserData}
      />
    </div>
  );
}

