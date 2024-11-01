
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface JobDescriptionFormData {
  title: string;
  responsibilities: string;
  requirements: string;
  location: string;
  jobType: string;
}

interface JobDescriptionFormProps {
  data: JobDescriptionFormData;
  onNext: () => void;
  onPrevious: () => void;
  onDataChange: (data: JobDescriptionFormData) => void;
}

export default function JobDescriptionForm({ data, onNext, onPrevious, onDataChange }: JobDescriptionFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });
  };

  return (
    <div>
      <Label htmlFor="title">Job Title</Label>
      <Input id="title" name="title" value={data.title} onChange={handleChange} />
      <Label htmlFor="responsibilities">Responsibilities</Label>
      <Input id="responsibilities" name="responsibilities" value={data.responsibilities} onChange={handleChange} />
      <Label htmlFor="requirements">Requirements</Label>
      <Input id="requirements" name="requirements" value={data.requirements} onChange={handleChange} />
      <Label htmlFor="location">Location</Label>
      <Input id="location" name="location" value={data.location} onChange={handleChange} />
      <Label htmlFor="jobType">Job Type</Label>
      <Input id="jobType" name="jobType" value={data.jobType} onChange={handleChange} />
      <div className="flex justify-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
