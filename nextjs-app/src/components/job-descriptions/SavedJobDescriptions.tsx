'use client';

import { Button } from '@/components/ui/button';
import { Copy, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useAuth } from '@/lib/auth';
// import { useRouter } from 'next/navigation';
import JobDescriptionDialog from './JobDescriptionDialog';

interface JobDescription {
  id: string;
  description: string;
  createdAt: string;
  company?: string;
  role?: string;
  pdfUrl?: string;
}

interface SavedJobDescriptionsProps {
  showAll?: boolean;
}

export default function SavedJobDescriptions({ showAll = false }: SavedJobDescriptionsProps) {
  // const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobDescriptions = async () => {
      if (!isAuthenticated || !user?.id) return;
  
      setIsLoading(true); 
  
      try {
        const response = await axios.get("/api/user/get-user");
        const userData = response.data?.data || {};
        // Sort job descriptions by createdAt in descending order (newest first)
        const sortedDescriptions = (userData.jobDescriptions || []).sort((a: JobDescription, b: JobDescription) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setJobDescriptions(sortedDescriptions);
      } catch (error: unknown) {
        console.error("Error fetching job descriptions:", error);
  
        toast({
          title: "Error",
          description:
            "Failed to load job descriptions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false); 
      }
    };
  
    fetchJobDescriptions();
  }, [isAuthenticated, user?.id, toast]);

  const handleViewResume = (jobId: string, pdfUrl?: string) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast({
        title: "No Resume Found",
        description: "No resume has been generated for this job description yet.",
        variant: "destructive",
      });
    }
  };

  const handleJobClick = (job: JobDescription) => {
    setSelectedJob(job);
  };

  if (authLoading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
          My Saved Job Descriptions
        </h2>
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <div className="h-6 w-48 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
          Login to view your saved job descriptions
        </h2>
        <Link href="/signin">
          <Button>
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
          My Saved Job Descriptions
        </h2>
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Loading your job descriptions...
          </p>
        </div>
      </div>
    );
  }

  if (jobDescriptions.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
          My Saved Job Descriptions
        </h2>
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            You have no job descriptions saved yet.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
            Start by entering a job description above to generate your optimized resume.
          </p>
        </div>
      </div>
    );
  }

  const displayedJobs = showAll ? jobDescriptions : jobDescriptions.slice(0, 6);
  const hasMoreJobs = !showAll && jobDescriptions.length > 6;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
          {showAll ? 'All Job Descriptions' : 'My Saved Job Descriptions'}
        </h2>
        {hasMoreJobs && (
          <Link href="/job-descriptions">
            <Button variant="outline" className="flex items-center gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedJobs.map((job) => (
          <div
            key={job.id}
            className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer"
            onClick={() => handleJobClick(job)}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  {job.role || 'Job Description'}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(job.description);
                    toast({
                      title: "Copied!",
                      description: "Job description copied to clipboard",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4">
                {job.description}
              </p>
              <div className="mt-auto space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewResume(job.id, job.pdfUrl);
                  }}
                >
                  <FileText className="h-4 w-4" />
                  <span>View Resume</span>
                </Button>
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <JobDescriptionDialog
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        jobDescription={selectedJob}
        onViewResume={handleViewResume}
      />
    </div>
  );
} 