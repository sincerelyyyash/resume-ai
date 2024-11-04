
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface EducationFormData {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface EducationFormProps {
  data: EducationFormData;
  onNext: () => void;
  onPrevious: () => void;
  onDataChange: (data: EducationFormData) => void;
}

export default function EducationForm({ data, onNext, onPrevious, onDataChange }: EducationFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-lg shadow-2xl w-full max-w-2xl">
        <Label htmlFor="institution" className="block mb-2 text-lg">Institution</Label>
        <Input id="institution" name="institution" value={data.institution} onChange={handleChange} />

        <Label htmlFor="degree" className="block mt-4 mb-2 text-lg">Degree</Label>
        <Input id="degree" name="degree" value={data.degree} onChange={handleChange} />

        <Label htmlFor="startDate" className="block mt-4 mb-2 text-lg">Start Date</Label>
        <Input id="startDate" name="startDate" type="date" value={data.startDate} onChange={handleChange} />

        <Label htmlFor="endDate" className="block mt-4 mb-2 text-lg">End Date</Label>
        <Input id="endDate" name="endDate" type="date" value={data.endDate} onChange={handleChange} />

        <div className="flex justify-between mt-8">
          <Button onClick={onPrevious}>Previous</Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}

