'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SavedJobDescriptions from '@/components/job-descriptions/SavedJobDescriptions';

export default function AllJobDescriptionsPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          onClick={() => router.push('/dashboard')}
          variant="ghost"
          className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>
      <SavedJobDescriptions showAll={true} />
    </div>
  );
} 