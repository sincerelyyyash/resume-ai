
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
    <div>
      <Label htmlFor="name">Project Name</Label>
      <Input id="name" name="name" value={data.name} onChange={handleChange} />
      <Label htmlFor="technologies">Technologies</Label>
      <Input id="technologies" name="technologies" value={data.technologies} onChange={handleChange} />
      <Label htmlFor="url">Project URL</Label>
      <Input id="url" name="url" value={data.url} onChange={handleChange} />
      <Label htmlFor="startDate">Start Date</Label>
      <Input id="startDate" name="startDate" type="date" value={data.startDate} onChange={handleChange} />
      <Label htmlFor="endDate">End Date</Label>
      <Input id="endDate" name="endDate" type="date" value={data.endDate} onChange={handleChange} />
      <Label htmlFor="achievements">Achievements</Label>
      <Input id="achievements" name="achievements" value={data.achievements} onChange={handleChange} />
      <div className="flex justify-between">
        {onPrevious && <Button onClick={onPrevious}>Previous</Button>}
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
