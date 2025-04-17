import JobDescriptionForm from '@/components/forms/JobDescriptionForm';
import { FlipWords } from '@/components/ui/flip-words';
import SavedJobDescriptions from '@/components/job-descriptions/SavedJobDescriptions';

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