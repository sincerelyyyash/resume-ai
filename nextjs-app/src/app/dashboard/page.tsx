import { Metadata } from "next";
import JobDescriptionForm from '@/components/forms/JobDescriptionForm';
import { FlipWords } from '@/components/ui/flip-words';
import SavedJobDescriptions from '@/components/job-descriptions/SavedJobDescriptions';

export const metadata: Metadata = {
  title: 'Dashboard | Resume AI',
  description: 'Manage your job descriptions and create optimized resumes with AI assistance.',
  keywords: 'resume dashboard, job descriptions, AI resume optimization, career management',
};

export default function DashboardPage() {
    const words = ["Getting Noticed", "Getting Shortlisted", "your Dream Job"];
 
  return (
    <div className="h-full p-8">
       <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 text-center py-10">
        One step closer to 
        <FlipWords words={words} /> <br />
        with Resume-AI
      </div>
      <JobDescriptionForm />
      <SavedJobDescriptions />
    </div>
  );
}