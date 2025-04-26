"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { MotionDiv } from "./MotionDiv";
import { Cover } from "@/components/ui/cover";
import { useSession } from "next-auth/react";

export const Hero = () => {
  const { data: session } = useSession(); 
  const isLoggedIn = !!session;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      {/* Left Column - Name and Title */}
      <div className="flex-1">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Cover>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Resume-AI
            </h1>
          </Cover>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">
            AI-Powered Resume Optimization Platform
          </p>
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
          {!isLoggedIn && (
            <>
              <p className="text-zinc-600 dark:text-zinc-400">contact@resume-ai.com</p>
              <p className="text-zinc-600 dark:text-zinc-400">www.resume-ai.com</p>
            </>
          )}
          <div className="mt-4 flex flex-col justify-end gap-4">
            {isLoggedIn ? (
              <>
                <Link href="/user/profile" >
                  <Button size="sm" className=" hover:text-black">
                    View Profile
                    <User className="ml-2 h-2 w-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-zinc-900 text-white border-2 hover:text-black">
                    Dashboard
                    <ArrowRight className="ml-2 h-2 w-2" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="sm">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="sm" variant="outline">
                    Try Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};
