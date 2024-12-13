
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MotionDiv from "../motion-div";

export interface EducationFormData {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface EducationFormProps {
  iteration: number;
  data: EducationFormData;
  onNext: () => void;
  onPrevious: () => void;
  onDataChange: (data: EducationFormData) => void;
}

export default function EducationForm({ iteration, data, onNext, onPrevious, onDataChange }: EducationFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ ...data, [name]: value });
  };

  const adviceMessages = [
    "Education is the foundation of your career path.",
    "Degree programs demonstrate your commitment to learning.",
    "Employers value your educational background alongside experience.",
    "Your degree can open doors to new opportunities.",
    "Make sure to highlight relevant coursework or achievements."
  ];

  const advice = adviceMessages[(iteration - 1) % adviceMessages.length];

  return (
    <MotionDiv className="flex items-center justify-between flex-row min-h-screen">
      <div className="bg-white dark:bg-zinc-900 p-10 w-full max-w-2xl">
        <div className="flex flex-col relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold my-2">
          <p>{iteration}</p>
          <p>{advice}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-lg shadow-2xl w-full max-w-2xl">
        <Label htmlFor="institution" className="block mb-2 text-lg">Institution</Label>
        <Input id="institution" name="institution" placeholder="IIT... jk" value={data.institution} onChange={handleChange} />

        <Label htmlFor="degree" className="block mt-4 mb-2 text-lg">Degree</Label>
        <Input id="degree" name="degree" placeholder="Bachelors in Technology" value={data.degree} onChange={handleChange} />

        <Label htmlFor="startDate" className="block mt-4 mb-2 text-lg">Start Date</Label>
        <Input id="startDate" name="startDate" type="date" value={data.startDate} onChange={handleChange} />

        <Label htmlFor="endDate" className="block mt-4 mb-2 text-lg">End Date</Label>
        <Input id="endDate" name="endDate" type="date" value={data.endDate} onChange={handleChange} />

        {/* <div className="flex justify-between mt-8"> */}
        {/*   <Button onClick={onPrevious}>Previous</Button> */}
        {/*   <Button onClick={onNext}>Next</Button> */}
        {/* </div> */}
      </div>
    </MotionDiv>
  );
}

