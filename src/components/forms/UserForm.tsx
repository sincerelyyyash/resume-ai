
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
    <div>
      <Label htmlFor="name">Name</Label>
      <Input id="name" name="name" value={data.name} onChange={handleChange} />
      <Label htmlFor="email">Email</Label>
      <Input id="email" name="email" value={data.email} onChange={handleChange} />
      <Label htmlFor="password">Password</Label>
      <Input id="password" name="password" type="password" value={data.password} onChange={handleChange} />
      <Label htmlFor="bio">Bio</Label>
      <Input id="bio" name="bio" value={data.bio} onChange={handleChange} />
      <Label htmlFor="portfolio">Portfolio</Label>
      <Input id="portfolio" name="portfolio" value={data.portfolio} onChange={handleChange} />
      <Label htmlFor="linkedin">LinkedIn</Label>
      <Input id="linkedin" name="linkedin" value={data.linkedin} onChange={handleChange} />
      <Label htmlFor="github">GitHub</Label>
      <Input id="github" name="github" value={data.github} onChange={handleChange} />
      <div className="flex justify-between">
        {onPrevious && <Button onClick={onPrevious}>Previous</Button>}
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
