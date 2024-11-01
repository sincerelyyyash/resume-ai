
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
    <div>
      <Label htmlFor="institution">Institution</Label>
      <Input id="institution" name="institution" value={data.institution} onChange={handleChange} />
      <Label htmlFor="degree">Degree</Label>
      <Input id="degree" name="degree" value={data.degree} onChange={handleChange} />
      <Label htmlFor="startDate">Start Date</Label>
      <Input id="startDate" name="startDate" type="date" value={data.startDate} onChange={handleChange} />
      <Label htmlFor="endDate">End Date</Label>
      <Input id="endDate" name="endDate" type="date" value={data.endDate} onChange={handleChange} />
      <div className="flex justify-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
