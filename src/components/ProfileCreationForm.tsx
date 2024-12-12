
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProjectForm, { ProjectFormData } from "@/components/forms/ProjectForm";
import EducationForm, { EducationFormData } from "@/components/forms/EducationForm";
import ExperienceForm, { ExperienceFormData } from "@/components/forms/ExperienceForm";
import SkillForm, { SkillFormData } from "@/components/forms/SkillForm";

interface MultiStepFormData {
  projects: ProjectFormData[];
  educations: EducationFormData[];
  experiences: ExperienceFormData[];
  skills: SkillFormData[]; // Change from single skill to an array of skills
}

export function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<MultiStepFormData>({
    projects: [{
      name: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
      achievements: "",
    }],
    educations: [{
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
    }],
    experiences: [{
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      location: "",
    }],
    skills: [{ name: "", category: "", level: "", yearsOfExperience: "" }], // Initial skill entry
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/formSubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to submit form data");
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
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
            : { name: "", category: "", level: "", yearsOfExperience: "" }; // For skills

    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newEntry],
    }));
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
        );
      case 1:
        return (
          <div>
            {renderFormHeader("educations")}
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
        );
      case 2:
        return (
          <div>
            {renderFormHeader("experiences")}
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
        );
      case 3:
        return (
          <div>
            {renderFormHeader("skills")}
            {formData.skills.map((skill, index) => (
              <SkillForm
                key={index}
                data={skill}
                iteration={index + 1}
                onNext={index === formData.skills.length - 1 ? handleNext : () => { }}
                onDataChange={(data) => {
                  const updatedSkills = [...formData.skills];
                  updatedSkills[index] = data;
                  setFormData((prev) => ({ ...prev, skills: updatedSkills }));
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="modal">{renderFormStep()}</div>;
}

export default MultiStepForm;

