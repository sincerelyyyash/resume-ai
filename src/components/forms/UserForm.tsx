
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  bio: string;
  portfolio: string;
  linkedin: string;
  github: string;
}

interface UserFormProps {
  data: UserFormData;
  onNext: () => void;
  onPrevious?: () => void;
  onDataChange: (data: UserFormData) => void;
}

export default function UserForm({ data, onNext, onPrevious, onDataChange }: UserFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-lg shadow-2xl w-full max-w-2xl">
        <Label htmlFor="name" className="block mb-2 text-lg">Name</Label>
        <Input id="name" name="name" value={data.name} onChange={handleChange} />

        <Label htmlFor="email" className="block mt-4 mb-2 text-lg">Email</Label>
        <Input id="email" name="email" value={data.email} onChange={handleChange} />

        <Label htmlFor="password" className="block mt-4 mb-2 text-lg">Password</Label>
        <Input id="password" name="password" type="password" value={data.password} onChange={handleChange} />

        <Label htmlFor="bio" className="block mt-4 mb-2 text-lg">Bio</Label>
        <Input id="bio" name="bio" value={data.bio} onChange={handleChange} />

        <Label htmlFor="portfolio" className="block mt-4 mb-2 text-lg">Portfolio</Label>
        <Input id="portfolio" name="portfolio" value={data.portfolio} onChange={handleChange} />

        <Label htmlFor="linkedin" className="block mt-4 mb-2 text-lg">LinkedIn</Label>
        <Input id="linkedin" name="linkedin" value={data.linkedin} onChange={handleChange} />

        <Label htmlFor="github" className="block mt-4 mb-2 text-lg">GitHub</Label>
        <Input id="github" name="github" value={data.github} onChange={handleChange} />

        <div className="flex justify-between mt-8">
          {onPrevious && <Button onClick={onPrevious}>Previous</Button>}
          <Button onClick={onNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}

