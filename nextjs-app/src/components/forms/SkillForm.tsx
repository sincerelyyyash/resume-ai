
import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MotionDiv from "../motion-div";

export interface SkillFormData {
  name: string;
  category: string;
  level: string;
  yearsOfExperience: string;
}

interface SkillFormProps {
  iteration: number;
  data: SkillFormData;
  onNext: () => void;
  onPrevious: () => void;
  onDataChange: (data: SkillFormData) => void;
}

export default function SkillForm({ iteration, data, onNext, onPrevious, onDataChange }: SkillFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "yearsOfExperience" && isNaN(Number(value)) && value !== "") {
      return;
    }
    onDataChange({ ...data, [name]: value });
  };

  const adviceMessages = [
    "Highlight your key skills to demonstrate your expertise to potential employers.",
    "Tailor your skills list to match the requirements of the job you're applying for.",
    "Including relevant technical and soft skills makes you a well-rounded candidate.",
    "Showcase skills that demonstrate both your experience and your ability to learn.",
    "Use specific examples of how you've applied your skills in real-world projects."
  ];

  const advice = adviceMessages[(iteration - 1) % adviceMessages.length];

  const skillExamples = [
    "Nextjs, React, etc",
    "Docker, Kubernetes, etc",
    "Nodejs, Spring, etc",
    "C++, Java, Javascript, etc",
    "Github, Vscode, etc",
  ]

  const skillCategories = [
    "Frontend",
    "DevOPS",
    "Backend",
    "Languages",
    "Tools",
  ]

  const skillsEx = skillExamples[(iteration - 1) % skillExamples.length];
  const skillCategory = skillCategories[(iteration - 1) % skillCategories.length];

  return (
    <MotionDiv className="flex items-center justify-between flex-row min-h-screen">
      <div className="bg-white dark:bg-zinc-900 p-10 w-full max-w-2xl">
        <div className="flex flex-col relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold my-2">
          <p>{iteration}</p>
          <p>{advice}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-lg shadow-2xl w-full max-w-2xl">
        <Label htmlFor="name" className="block mb-2 text-lg">Skills names (comma-separated)</Label>
        <Input
          id="name"
          name="name"
          value={data.name}
          placeholder={skillsEx}
          onChange={handleChange}
        />

        <Label htmlFor="category" className="block mt-4 mb-2 text-lg">Category</Label>
        <Input
          id="category"
          name="category"
          value={data.category}
          placeholder={skillCategory}
          onChange={handleChange}
        />

        <Label htmlFor="level" className="block mt-4 mb-2 text-lg">Skill Level</Label>
        <select
          id="level"
          name="level"
          value={data.level}
          onChange={handleChange}
          className="p-2 border rounded-lg w-full bg-white dark:bg-zinc-800"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>

        <Label htmlFor="yearsOfExperience" className="block mt-4 mb-2 text-lg">Years of Experience</Label>
        <Input
          id="yearsOfExperience"
          name="yearsOfExperience"
          value={data.yearsOfExperience}
          onChange={handleChange}
          type="number"
          min="0"
          step="1"
        />
      </div>
    </MotionDiv>
  );
}

