'use client';

import { useState } from 'react';
import { TextArea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import MotionDiv from "@/components/motion-div";
import { useToast } from "@/hooks/use-toast";
import { optimizeResume } from '@/lib/resumeOptimiser';
import { useRouter } from 'next/navigation';

interface Keyword {
  keyword: string;
  count?: number;
  importance?: string;
}

export default function JobDescriptionForm() {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get user data
      const userResponse = await fetch('/api/user/get-user');
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();

      // Check if profile is complete
      const requiredFields = ['bio', 'portfolio', 'linkedin', 'github'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Incomplete Profile",
          description: "Please complete your profile before generating a resume.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Optimize resume
      const optimizedResume = await optimizeResume(jobDescription, JSON.stringify(userData));
      
      // Store in localStorage with the correct structure
      localStorage.setItem('optimizedResume', JSON.stringify({
        data: optimizedResume.optimized_resume,
        atsScore: optimizedResume.analysis.ats_score,
        matchedKeywords: optimizedResume.analysis.matched_keywords.map((k: Keyword) => k.keyword),
        missingKeywords: optimizedResume.analysis.missing_keywords.map((k: Keyword) => k.keyword),
        recommendations: optimizedResume.analysis.recommendations,
        contentAnalysis: optimizedResume.analysis.content_analysis
      }));

      // Generate PDF
      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          userData: optimizedResume.optimized_resume
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate PDF');
      }

      const responseData = await response.json();
      
      // Store PDF info in localStorage
      localStorage.setItem('resumePdf', JSON.stringify({
        filename: responseData.data.pdf.filename,
        url: responseData.data.pdf.url
      }));

      // Navigate to preview
      router.push('/resume-preview');
    } catch (error: unknown) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            placeholder="Paste the job description here & leave the rest to us"
            className="min-h-[200px] text-base resize-none bg-transparent focus:outline-none focus:ring-0 border-none shadow-none"
            disabled={isLoading}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Generating...' : 'Generate Resume with AI'}
            </Button>
          </div>
        </form>
      </div>
    </MotionDiv>
  );
}
