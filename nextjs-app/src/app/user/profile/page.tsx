"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

import ProjectSection from "@/components/profile/ProjectSection";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import ExperienceSection from "@/components/profile/ExperienceSection";
import SkillsSection from "@/components/profile/SkillsSection";
import EducationSection from "@/components/profile/EducationSection";
// import CertificationSection from "@/components/profile/CertificationSection";

interface UserData {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  image: string | null;
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    url: string;
    startDate: string;
    endDate: string;
  }[];
  experiences: {
    id: string;
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
  }[];
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
  skills: {
    id: string;
    name: string;
    level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    category: string;
    yearsOfExperience: number;
  }[];
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

const ProfileHeaderSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border rounded-lg">
      <div className="h-24 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex-1 space-y-3">
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-80 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="flex gap-4 mt-4">
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
    </div>
  </div>
);

const SectionSkeleton = ({ title }: { title: string }) => (
  <div className="animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
    </div>
    <div className="grid gap-4">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="p-4 border rounded-lg space-y-3 bg-zinc-50 dark:bg-zinc-900"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkillsSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Skills</h2>
      <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-4 border rounded-lg space-y-3 bg-zinc-50 dark:bg-zinc-900"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="flex flex-col mt-10 space-y-10 pb-20 max-w-6xl w-full">
    <ProfileHeaderSkeleton />
    <SectionSkeleton title="Projects" />
    <SectionSkeleton title="Experience" />
    <SectionSkeleton title="Education" />
    <SkillsSkeleton />
  </div>
);

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !user?.id || isFetching) {
      if (!isFetching) setIsLoading(false);
      return;
    }

    try {
      setIsFetching(true);
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
      setIsFetching(false);
    }
  }, [isAuthenticated, user?.id, toast, isFetching]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (authLoading || isLoading) {
    return <ProfileSkeleton />;
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
        <UserProfileHeader userData={userData} onSave={fetchUserData} />
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

      {/* <CertificationSection
        certifications={userData?.certifications || []}
        showEdit={true}
        showAddNew={true}
        onSave={fetchUserData}
        onDelete={fetchUserData}
      /> */}
    </div>
  );
}