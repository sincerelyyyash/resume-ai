
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ProjectFormData {
  name: string;
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string;
  achievements: string;
}

interface ProjectFormProps {
  data: ProjectFormData;
  onNext: () => void;
  onPrevious?: () => void;
  onDataChange: (data: ProjectFormData) => void;
}

export default function ProjectForm({ data, onNext, onPrevious, onDataChange }: ProjectFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-lg shadow-2xl w-full max-w-2xl">
        <Label htmlFor="name" className="block mb-2 text-lg">Project Name</Label>
        <Input id="name" name="name" value={data.name} onChange={handleChange} />

        <Label htmlFor="technologies" className="block mt-4 mb-2 text-lg">Technologies</Label>
        <Input id="technologies" name="technologies" value={data.technologies.join(", ")} onChange={handleChange} />

        <Label htmlFor="url" className="block mt-4 mb-2 text-lg">Project URL</Label>
        <Input id="url" name="url" value={data.url} onChange={handleChange} />

        <Label htmlFor="startDate" className="block mt-4 mb-2 text-lg">Start Date</Label>
        <Input id="startDate" name="startDate" type="date" value={data.startDate} onChange={handleChange} />

        <Label htmlFor="endDate" className="block mt-4 mb-2 text-lg">End Date</Label>
        <Input id="endDate" name="endDate" type="date" value={data.endDate} onChange={handleChange} />

        <Label htmlFor="achievements" className="block mt-4 mb-2 text-lg">Achievements</Label>
        <Input id="achievements" name="achievements" value={data.achievements} onChange={handleChange} />

        <div className="flex justify-between mt-8">
          {onPrevious && <Button onClick={onPrevious}>Previous</Button>}
          <Button onClick={onNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}

