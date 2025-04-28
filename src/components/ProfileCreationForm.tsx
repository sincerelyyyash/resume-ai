"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProjectForm, { ProjectFormData } from "@/components/forms/ProjectForm";
import EducationForm, { EducationFormData } from "@/components/forms/EducationForm";
import ExperienceForm, { ExperienceFormData } from "@/components/forms/ExperienceForm";
import SkillForm, { SkillFormData } from "@/components/forms/SkillForm";
import { useAuth } from "@/lib/auth";
import axios from "axios"
import { useToast } from "@/hooks/use-toast";

interface MultiStepFormData {
  userId: string;
  projects: ProjectFormData[];
  educations: EducationFormData[];
  experiences: ExperienceFormData[];
  skills: SkillFormData[];
}

export function MultiStepForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<MultiStepFormData>({
    userId: user?.id || "",
    projects: [
      {
        name: "",
        technologies: [],
        url: "",
        startDate: "",
        endDate: "",
        achievements: "",
      },
    ],
    educations: [
      {
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
      },
    ],
    experiences: [
      {
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "",
      },
    ],
    skills: [{ name: "", category: "", level: "Beginner", yearsOfExperience: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to submit your profile.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        userId: user.id,
        projects: formData.projects,
        educations: formData.educations,
        experiences: formData.experiences,
        skills: formData.skills,
      };

      await axios.post("/api/user/submit-form", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast({
        title: "Profile Submitted",
        description: "Your profile has been saved successfully.",
      });

      router.push("/");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "An unexpected error occurred"
        : "An unexpected error occurred";

      setError(message);

      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="modal">
        <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800 mx-auto" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="modal">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
            Please sign in to create your profile
          </h2>
          <Button onClick={() => router.push("/signin")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const validateUrl = (url: string): string => {
    try {
      new URL(url);
      return url;
    } catch {
      return "";
    }
  };

  const addNewEntry = (section: "projects" | "educations" | "experiences" | "skills") => {
    const newEntry =
      section === "projects"
        ? { name: "", technologies: [], url: "", startDate: "", endDate: "", achievements: "" }
        : section === "educations"
          ? { institution: "", degree: "", startDate: "", endDate: "" }
          : section === "experiences"
            ? { jobTitle: "", company: "", startDate: "", endDate: "", description: "", location: "" }
            : { name: "", category: "", level: "", yearsOfExperience: "" };

    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newEntry],
    }));

    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 0);
  };

  const renderFormHeader = (section: "projects" | "educations" | "experiences" | "skills" | null = null) => {
    const canAddMore = section ? formData[section].length < 5 : true;

    return (
      <div className="flex justify-end items-center gap-2 max-w-7xl px-4">
        {section && canAddMore && (
          <Button onClick={() => addNewEntry(section)}>
            Add Another {section.slice(0, -1).charAt(0).toUpperCase() + section.slice(1)}
          </Button>
        )}
        {step > 0 && <Button onClick={handlePrevious}>Previous</Button>}
        {step < 3 && <Button onClick={handleNext}>Next</Button>}
        {step === 3 && (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    );
  };

  const renderFormStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            {renderFormHeader("projects")}
            <div ref={containerRef}>
              {formData.projects.map((project, index) => (
                <ProjectForm
                  key={index}
                  data={project}
                  iteration={index + 1}
                  onNext={index === formData.projects.length - 1 ? handleNext : () => { }}
                  onDataChange={(data) => {
                    const updatedProjects = [...formData.projects];
                    updatedProjects[index] = data;
                    setFormData((prev) => ({ ...prev, projects: updatedProjects }));
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            {renderFormHeader("educations")}
            <div ref={containerRef}>
              {formData.educations.map((education, index) => (
                <EducationForm
                  key={index}
                  data={education}
                  iteration={index + 1}
                  onNext={index === formData.educations.length - 1 ? handleNext : () => { }}
                  onPrevious={handlePrevious}
                  onDataChange={(data) => {
                    const updatedEducations = [...formData.educations];
                    updatedEducations[index] = data;
                    setFormData((prev) => ({ ...prev, educations: updatedEducations }));
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            {renderFormHeader("experiences")}
            <div ref={containerRef}>
              {formData.experiences.map((experience, index) => (
                <ExperienceForm
                  key={index}
                  data={experience}
                  iteration={index + 1}
                  onNext={index === formData.experiences.length - 1 ? handleNext : () => { }}
                  onPrevious={handlePrevious}
                  onDataChange={(data) => {
                    const updatedExperiences = [...formData.experiences];
                    updatedExperiences[index] = data;
                    setFormData((prev) => ({ ...prev, experiences: updatedExperiences }));
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            {renderFormHeader("skills")}
            <div ref={containerRef}>
              {formData.skills.map((skill, index) => (
                <SkillForm
                  key={index}
                  data={skill}
                  iteration={index + 1}
                  onNext={index === formData.skills.length - 1 ? handleNext : () => { }}
                  onPrevious={handlePrevious}
                  onDataChange={(data) => {
                    const updatedSkills = [...formData.skills];
                    updatedSkills[index] = data;
                    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
                  }}
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="modal">{renderFormStep()}</div>;
}

export default MultiStepForm;

