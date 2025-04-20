"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MotionDiv } from "./MotionDiv";
import { Cover } from "@/components/ui/cover";
import { useSession } from "next-auth/react";

export const Hero = () => {
  const { data: session } = useSession(); 
  const isLoggedIn = !!session;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-900" />

      {/* Animated background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Cover>
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50 mb-6">
                Transform Your Resume with AI
              </h1>
            </Cover>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 mb-8 max-w-2xl mx-auto">
              Create professional, ATS-friendly resumes that get you noticed. Powered by advanced AI technology.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="border-2">
                    Try Demo
                  </Button>
                </Link>
              </>
            )}
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12"
          >
            <div className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-700"
                  />
                ))}
              </div>
              <span>Trusted by 1000+ professionals</span>
            </div>
          </MotionDiv>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white dark:from-zinc-900 to-transparent" />
    </section>
  );
};
