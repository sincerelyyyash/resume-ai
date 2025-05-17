
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TextArea } from "../ui/text-area";
import MotionDiv from "../motion-div";

export interface ProjectFormData {
  name: string;
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string;
  achievements: string;
}

interface ProjectFormProps {
  iteration: number;
  data: ProjectFormData;
  onNext: () => void;
  onPrevious?: () => void;
  onDataChange: (data: ProjectFormData) => void;
}

export default function ProjectForm({ iteration, data, onNext, onPrevious, onDataChange }: ProjectFormProps) {
  const adviceMessages = [
    "Adding projects showcases your practical skills.",
    "Projects demonstrate your problem-solving abilities.",
    "Employers love to see hands-on experience keep building!",
    "More projects can help your resume stand out.",
    "Highlight your achievements through detailed project descriptions.",
  ];

  const advice = adviceMessages[(iteration - 1) % adviceMessages.length];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "technologies") {
      const technologiesArray = value.split(",").map((tech) => tech.trim());
      onDataChange({ ...data, [name]: technologiesArray });
    } else {
      onDataChange({ ...data, [name]: value });
    }
  };

  return (
    <MotionDiv className="flex items-center justify-between flex-row min-h-screen">
      <div className="bg-white dark:bg-zinc-900 p-10 w-full max-w-2xl">
        <div className="flex flex-col relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold my-2">
          <p>{iteration}</p>
          <p>{advice}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-lg shadow-2xl w-full max-w-2xl">
        <Label htmlFor="name" className="block mb-2 text-lg">Project Name</Label>
        <Input id="name" name="name" placeholder="E-Commerce Application" value={data.name} onChange={handleChange} />

        <Label htmlFor="technologies" className="block mt-4 mb-2 text-lg">Technologies</Label>
        <Input
          id="technologies"
          placeholder="Enter comma-separated values (e.g., React, Node.js, MongoDB)"
          name="technologies"
          value={data.technologies.join(", ")}
          onChange={handleChange}
        />

        <Label htmlFor="achievements" className="block mt-4 mb-2 text-lg">Project Info</Label>
        <TextArea
          name="achievements"
          placeholder="Describe your project here"
          value={data.achievements}
          onChange={handleChange}
        />

        <Label htmlFor="url" className="block mt-4 mb-2 text-lg">Project URL</Label>
        <Input id="url" name="url" value={data.url} placeholder="Live link/ Github Repo" onChange={handleChange} />

        <Label htmlFor="startDate" className="block mt-4 mb-2 text-lg">Start Date</Label>
        <Input id="startDate" name="startDate" type="date" value={data.startDate} onChange={handleChange} />

        <Label htmlFor="endDate" className="block mt-4 mb-2 text-lg">End Date</Label>
        <Input id="endDate" name="endDate" type="date" value={data.endDate} onChange={handleChange} />
      </div>
    </MotionDiv>
  );
}
