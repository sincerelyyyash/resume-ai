
"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProjectForm, { ProjectFormData } from "@/components/forms/ProjectForm";
import EducationForm, { EducationFormData } from "@/components/forms/EducationForm";
import ExperienceForm, { ExperienceFormData } from "@/components/forms/ExperienceForm";
import SkillForm, { SkillFormData } from "@/components/forms/SkillForm";
import { useSession } from "next-auth/react";
import axios from "axios"

interface MultiStepFormData {
  userId: string;
  projects: ProjectFormData[];
  educations: EducationFormData[];
  experiences: ExperienceFormData[];
  skills: SkillFormData[];
}

export function MultiStepForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<MultiStepFormData>({
    userId: session?.user.id || "",
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
    setLoading(true);
    setError(null);

    try {
      const payload = {
        userId: formData.userId,
        projects: formData.projects.map((project) => ({
          ...project,
          url: validateUrl(project.url),
        })),
        educations: formData.educations.map((education) => education),
        experiences: formData.experiences.map((experience) => experience),
        skills: formData.skills.map((skill) => skill),
      };

      await axios.post("/api/user/submit-form", payload, {
        headers: { "Content-Type": "application/json" },
      });

      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };



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

