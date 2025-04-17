'use client';

import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { TextArea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import MotionDiv from "@/components/motion-div";

export default function JobDescriptionForm() {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement AI resume generation
    console.log('Generating resume with job description:', jobDescription);
  };

  return (
    <MotionDiv className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-100">
            Enter Job Description
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">

              <TextArea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[300px] text-base"
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="px-8 py-6 text-lg  text-black rounded-lg transition-colors"
              >
                Generate Resume with AI
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MotionDiv>
  );
} 