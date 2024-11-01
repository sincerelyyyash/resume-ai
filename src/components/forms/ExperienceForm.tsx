
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
    <div>
      <Label htmlFor="jobTitle">Job Title</Label>
      <Input id="jobTitle" name="jobTitle" value={data.jobTitle} onChange={handleChange} />
      <Label htmlFor="company">Company</Label>
      <Input id="company" name="company" value={data.company} onChange={handleChange} />
      <Label htmlFor="startDate">Start Date</Label>
      <Input id="startDate" name="startDate" type="date" value={data.startDate} onChange={handleChange} />
      <Label htmlFor="endDate">End Date</Label>
      <Input id="endDate" name="endDate" type="date" value={data.endDate} onChange={handleChange} />
      <Label htmlFor="description">Description</Label>
      <Input id="description" name="description" value={data.description} onChange={handleChange} />
      <Label htmlFor="location">Location</Label>
      <Input id="location" name="location" value={data.location} onChange={handleChange} />
      <div className="flex justify-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
