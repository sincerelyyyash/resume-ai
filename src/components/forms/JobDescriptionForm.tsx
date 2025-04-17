'use client';

import { useState } from 'react';
import { TextArea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import MotionDiv from "@/components/motion-div";

export default function JobDescriptionForm() {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating resume with job description:', jobDescription);
  };

  return (
    <MotionDiv className="flex flex-col items-center justify-center w-full px-4 pb-6">
      <div className="w-full max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-md p-4 sm:p-6 space-y-4"
        >
          <TextArea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder=" Paste the job description here & leave the rest to us"
            className="min-h-[200px] text-base resize-none bg-transparent focus:outline-none focus:ring-0 border-none shadow-none"
          />

          <div className="flex justify-center">
            <Button
              type="submit"
            //   className="bg-gradient-to-br from-black to-zinc-800 hover:from-zinc-900 hover:to-black text-white text-sm sm:text-base px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Generate Resume with AI
            </Button>
          </div>
        </form>
      </div>
    </MotionDiv>
  );
}
