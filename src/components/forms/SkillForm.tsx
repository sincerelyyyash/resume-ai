
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-lg shadow-2xl w-full max-w-2xl">
        <Label htmlFor="name" className="block mb-2 text-lg">Skill Name</Label>
        <Input id="name" name="name" value={data.name} onChange={handleChange} />

        <Label htmlFor="category" className="block mt-4 mb-2 text-lg">Category</Label>
        <Input id="category" name="category" value={data.category} onChange={handleChange} />

        <Label htmlFor="level" className="block mt-4 mb-2 text-lg">Skill Level</Label>
        <Input id="level" name="level" value={data.level} onChange={handleChange} />

        <Label htmlFor="yearsOfExperience" className="block mt-4 mb-2 text-lg">Years of Experience</Label>
        <Input id="yearsOfExperience" name="yearsOfExperience" value={data.yearsOfExperience} onChange={handleChange} />

        <div className="flex justify-between mt-8">
          <Button onClick={onPrevious}>Previous</Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}

