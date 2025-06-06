import { Metadata } from "next";
import { MotionDiv } from "@/components/landing/MotionDiv";
import { SignInForm } from "@/components/SignInForm";

export const metadata: Metadata = {
  title: 'Sign In | Resume AI',
  description: 'Sign in to Resume AI to unlock the full potential of AI-driven resumes and job matching.',
  keywords: 'sign in, login, resume builder, AI resume, job matching',
};

export default function SigninPage() {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <MotionDiv
        className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 lg:px-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <MotionDiv
          className="text-3xl md:text-5xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Welcome Back to Resume-AI
        </MotionDiv>
        <MotionDiv
          className="hidden md:block text-lg md:text-xl lg:text-2xl font-medium max-w-md text-center mt-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-neutral-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Sign In To Unlock The Full Potential Of AI-driven Resumes and Job Matching.
        </MotionDiv>
        <MotionDiv
          className="hidden md:block text-lg md:text-xl lg:text-2xl font-medium max-w-md text-center mt-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-neutral-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Elevate Your Career, One Tailored Resume at a Time.
        </MotionDiv>
      </MotionDiv>
      <MotionDiv
        className="w-full lg:w-1/2 flex justify-center items-center px-4 lg:px-0"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <SignInForm />
      </MotionDiv>
    </div>
  );
}

