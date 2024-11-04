
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProjectForm, { ProjectFormData } from "@/components/forms/ProjectForm";
import EducationForm, { EducationFormData } from "@/components/forms/EducationForm";
import ExperienceForm, { ExperienceFormData } from "@/components/forms/ExperienceForm";
import JobDescriptionForm, { JobDescriptionFormData } from "@/components/forms/JobDescriptionForm";
import SkillForm, { SkillFormData } from "@/components/forms/SkillForm";

interface MultiStepFormData {
  project: ProjectFormData;
  education: EducationFormData;
  experience: ExperienceFormData;
  // jobDescription: JobDescriptionFormData;
  skill: SkillFormData;
}

export function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<MultiStepFormData>({
    project: {
      name: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
      achievements: ""
    }, education: { institution: "", degree: "", startDate: "", endDate: "" },
    experience: { jobTitle: "", company: "", startDate: "", endDate: "", description: "", location: "" },
    // jobDescription: { title: "", responsibilities: "", requirements: "", location: "", jobType: "" },
    skill: { name: "", category: "", level: "", yearsOfExperience: "" },
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

  const renderFormStep = () => {
    switch (step) {
      case 0:
        return (
          <ProjectForm
            data={formData.project}
            onNext={handleNext}
            onDataChange={(data) => setFormData((prev) => ({ ...prev, project: data }))}
          />
        );
      case 1:
        return (
          <EducationForm
            data={formData.education}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onDataChange={(data) => setFormData((prev) => ({ ...prev, education: data }))}
          />
        );
      case 2:
        return (
          <ExperienceForm
            data={formData.experience}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onDataChange={(data) => setFormData((prev) => ({ ...prev, experience: data }))}
          />
        );
      case 3:
        return (
          <SkillForm
            data={formData.skill}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onDataChange={(data) => setFormData((prev) => ({ ...prev, skill: data }))}
          />
        );
      default:
        return (
          <div>
            <h2>Review & Submit</h2>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        );
    }
  };

  return <div className="modal">{renderFormStep()}</div>;
}

export default MultiStepForm;
