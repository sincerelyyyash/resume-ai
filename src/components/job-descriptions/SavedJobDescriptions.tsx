'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface JobDescription {
  id: string;
  description: string;
  createdAt: string;
  company?: string;
  role?: string;
}

export default function SavedJobDescriptions() {
  const { data: session } = useSession();
  const jobDescriptions: JobDescription[] = []; 

  if (!session) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
          Login to view your saved job descriptions
        </h2>
        <Link href="/signin">
          <Button className="bg-gradient-to-br from-black to-zinc-800 hover:from-zinc-900 hover:to-black text-white">
            Sign In
          </Button>
        </Link>
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

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
        My Saved Job Descriptions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobDescriptions.map((job) => (
          <div
            key={job.id}
            className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
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
                  onClick={() => navigator.clipboard.writeText(job.description)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4">
                {job.description}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>{job.company || 'Unknown Company'}</span>
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 