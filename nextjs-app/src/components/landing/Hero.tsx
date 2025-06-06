"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MotionDiv } from "./MotionDiv";
import { Cover } from "@/components/ui/cover";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-1">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Cover>
              <div className="h-12 w-48 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded" />
            </Cover>
            <div className="h-6 w-64 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded mt-4" />
          </MotionDiv>
        </div>
        <div className="flex-1 text-right">
          <div className="h-8 w-32 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded mt-4 ml-auto" />
        </div>
      </div>
    );
  }

  // If authenticated, don't render the hero content
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      {/* Left Column - Name and Title */}
      <div className="flex-1">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Resume-AI
            </h1>
            <Cover>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">
            Create job-specific resumes that stand out, powered by AI.
            </p>
          </Cover>
        </MotionDiv>
      </div>

      {/* Right Column - Contact and CTA */}
      <div className="flex-1 text-right">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-2"
        >
          <div className="mt-4 flex flex-col justify-end gap-4">
            <Link href="/signin">
              <Button size="sm">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {/* <Link href="/demo">
              <Button size="sm" variant="outline">
                Try Demo
              </Button>
            </Link> */}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};
