'use client';

import { useEffect, useState } from 'react';
import ResumePreview from '@/components/resume/ResumePreview';
import { useRouter } from 'next/navigation';

interface ResumeData {
  data: {
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      achievements: string[];
    }>;
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
      achievements: string[];
    }>;
    skills: string[];
  };
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export default function ResumePreviewPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('optimizedResume');
    if (!storedData) {
      router.push('/dashboard');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setResumeData(parsedData);
    } catch (error) {
      console.error('Error parsing resume data:', error);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!resumeData) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <ResumePreview
        data={resumeData.data}
        atsScore={resumeData.atsScore}
        matchedKeywords={resumeData.matchedKeywords}
        missingKeywords={resumeData.missingKeywords}
      />
    </div>
  );
} 