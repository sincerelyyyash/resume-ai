"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

import ProjectSection from "@/components/profile/ProjectSection";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import { useToast } from "@/hooks/use-toast";
import ExperienceSection from "@/components/profile/ExperienceSection";
import SkillsSection from "@/components/profile/SkillsSection";
import EducationSection from "@/components/profile/EducationSection";

export default function Profile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await axios.post("/api/user/get-user", {
          userId: session.user.id,
        });

        if (res.data?.status === "success") {
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
      }
    };

    fetchUserData();
  }, [session?.user?.id, toast]);

  if (!userData) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  const { personalInfo, projects, experiences, education, skills } = userData;

  return (
    <div className="flex flex-col mt-10 space-y-10 pb-20 max-w-6xl">
      <UserProfileHeader
        name={personalInfo?.name}
        email={personalInfo?.email}
        bio={personalInfo?.bio}
        linkedin={personalInfo?.linkedin}
        github={personalInfo?.github}
        portfolio={personalInfo?.portfolio}
      />

      <ProjectSection
        projects={(projects || []).map((p: any, idx: number) => ({
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
        experiences={(experiences || []).map((exp: any, idx: number) => ({
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
        skills={(skills || []).map((skill: any, idx: number) => ({
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
        education={(education || []).map((edu: any, idx: number) => ({
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

