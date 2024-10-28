
import { SignInForm } from "@/components/SignInForm";

export default function SigninPage() {
  return (
    <div className="flex flex-col lg:flex-row mt-10 lg:mt-20">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 lg:px-0">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          Welcome Back to Resume-AI
        </h1>
        <p className="hidden md:block text-lg md:text-xl lg:text-2xl font-medium max-w-md text-center mt-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-neutral-100">
          Sign In To Unlock The Full Potential Of AI-driven Resumes and Job Matching.
        </p>
        <p className="hidden md:block text-lg md:text-xl lg:text-2xl font-medium max-w-md text-center mt-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-neutral-100">
          Elevate Your Career, One Tailored Resume at a Time.
        </p>
      </div>
      <div className="w-full lg:w-1/2 flex justify-center items-center px-4 lg:px-0">
        <SignInForm />
      </div>
    </div>
  );
}

