
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ExperienceFormData {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

interface ExperienceFormProps {
  data: ExperienceFormData;
  onNext: () => void;
  onPrevious: () => void;
  onDataChange: (data: ExperienceFormData) => void;
}

export default function ExperienceForm({ data, onNext, onPrevious, onDataChange }: ExperienceFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-lg shadow-2xl w-full max-w-2xl">
        <Label htmlFor="jobTitle" className="block mb-2 text-lg">Job Title</Label>
        <Input id="jobTitle" name="jobTitle" value={data.jobTitle} onChange={handleChange} />

        <Label htmlFor="company" className="block mt-4 mb-2 text-lg">Company</Label>
        <Input id="company" name="company" value={data.company} onChange={handleChange} />

        <Label htmlFor="startDate" className="block mt-4 mb-2 text-lg">Start Date</Label>
        <Input id="startDate" name="startDate" type="date" value={data.startDate} onChange={handleChange} />

        <Label htmlFor="endDate" className="block mt-4 mb-2 text-lg">End Date</Label>
        <Input id="endDate" name="endDate" type="date" value={data.endDate} onChange={handleChange} />

        <Label htmlFor="description" className="block mt-4 mb-2 text-lg">Description</Label>
        <Input id="description" name="description" value={data.description} onChange={handleChange} />

        <Label htmlFor="location" className="block mt-4 mb-2 text-lg">Location</Label>
        <Input id="location" name="location" value={data.location} onChange={handleChange} />

        <div className="flex justify-between mt-8">
          <Button onClick={onPrevious}>Previous</Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}

