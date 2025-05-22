
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TextArea } from "../ui/text-area";

export interface ExperienceFormData {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

interface ExperienceFormProps {
  iteration: number;
  data: ExperienceFormData;
  onNext: () => void;
  onPrevious: () => void;
  onDataChange: (data: ExperienceFormData) => void;
}

export default function ExperienceForm({ iteration, data, onDataChange }: ExperienceFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });
  };

  const adviceMessages = [
    "Work experience showcases your practical skills and expertise.",
    "A detailed job history helps employers understand your capabilities.",
    "Highlight your achievements to make your experience stand out.",
    "Employers value hands-on experience more than qualifications alone.",
    "Every job teaches something new make sure to share those lessons."
  ];

  const advice = adviceMessages[(iteration - 1) % adviceMessages.length];

  return (
    <div className="flex items-center justify-between flex-row min-h-screen">
      <div className="bg-white dark:bg-zinc-900 p-10 w-full max-w-2xl">
        <div className="flex flex-col relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold my-2">
          <p>{iteration}</p>
          <p>{advice}</p>
        </div>
      </div>
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
        <TextArea
          id="description"
          name="description"
          value={data.description}
          onChange={handleChange}
          placeholder="Describe your experience here"
          className="resize-none h-40"
        />

        <Label htmlFor="location" className="block mt-4 mb-2 text-lg">Location</Label>
        <Input id="location" name="location" value={data.location} onChange={handleChange} />
      </div>
    </div >
  );
}

