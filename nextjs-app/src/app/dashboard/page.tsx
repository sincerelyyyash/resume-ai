'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import JobDescriptionForm from '@/components/forms/JobDescriptionForm';
import { FlipWords } from '@/components/ui/flip-words';
import SavedJobDescriptions from '@/components/job-descriptions/SavedJobDescriptions';
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";

const loadingStates = [
  {
    text: "Analyzing your profile...",
  },
  {
    text: "Identifying key achievements...",
  },
  {
    text: "Optimizing content structure...",
  },
  {
    text: "Enhancing professional language...",
  },
  {
    text: "Formatting resume sections...",
  },
  {
    text: "Finalizing your resume...",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const words = ["Getting Noticed", "Getting Shortlisted", "your Dream Job"];

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const { data: profileResponse } = await axios.get("/api/user/profile-completion-status");
        console.log("Profile completion response:", profileResponse);
        
        if (!profileResponse?.success) {
          toast({
            title: "Profile Status Error",
            description: "Could not check profile completion status.",
            variant: "destructive",
          });
          return;
        }

        const completionPercentage = profileResponse.data.completionPercentage || 0;
        const hasMinimumRequiredFields = profileResponse.data.hasMinimumRequiredFields || false;
        
        console.log("Completion percentage:", completionPercentage);
        console.log("Has minimum required fields:", hasMinimumRequiredFields);

        if (!hasMinimumRequiredFields) {
          toast({
            title: "Incomplete Profile",
            description: "Please complete your basic profile information and add at least one skill to proceed.",
          });
          router.push("/user/profile");
        }
      } catch (err) {
        console.error("Profile status check error:", err);
        toast({
          title: "Error",
          description: "An error occurred while checking profile status.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkProfileCompletion();
  }, [router, toast]);

  const handleGenerateResume = async () => {
    setLoading(true);
    try {
      // Your existing resume generation logic here
      // When done, set loading to false
      // setLoading(false);
    } catch (error) {
      console.error("Error generating resume:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="h-full p-8">
       <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 text-center py-10">
        One step closer to 
        <FlipWords words={words} /> <br />
        with Resume-AI
      </div>
      <JobDescriptionForm />
      <SavedJobDescriptions />

      <button
        onClick={handleGenerateResume}
        className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center"
        style={{
          boxShadow:
            "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
        }}
      >
        Generate Resume with AI
      </button>

      <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={2000} />

      {loading && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}