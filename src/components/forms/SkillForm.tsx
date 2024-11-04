
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SkillFormData {
  name: string;
  category: string;
  level: string;
  yearsOfExperience: string;
}

interface SkillFormProps {
  data: SkillFormData;
  onNext: () => void;
  onPrevious: () => void;
  onDataChange: (data: SkillFormData) => void;
}

export default function SkillForm({ data, onNext, onPrevious, onDataChange }: SkillFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });
  };

  return (
    <div>
      <Label htmlFor="name">Skill Name</Label>
      <Input id="name" name="name" value={data.name} onChange={handleChange} />
      <Label htmlFor="category">Category</Label>
      <Input id="category" name="category" value={data.category} onChange={handleChange} />
      <Label htmlFor="level">Skill Level</Label>
      <Input id="level" name="level" value={data.level} onChange={handleChange} />
      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
      <Input id="yearsOfExperience" name="yearsOfExperience" value={data.yearsOfExperience} onChange={handleChange} />
      <div className="flex justify-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}