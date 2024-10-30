"use client"
import { motion } from "framer-motion";
import { SignupForm } from "@/components/SignUpForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col lg:flex-row mt-10 lg:mt-10">
      <motion.div
        className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 lg:px-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-2xl md:text-5xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 pt-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Create Your Account now on
        </motion.h1>
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20 pb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Resume-AI
        </motion.h1>
        <motion.p
          className="hidden md:block text-lg md:text-xl lg:text-2xl font-medium max-w-md text-center mt-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-neutral-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Sign Up to Start Harnessing The Power of AI to Enhance Your Job Applications.
        </motion.p>
        <motion.p
          className="hidden md:block text-lg md:text-xl lg:text-2xl font-medium max-w-md text-center mt-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-neutral-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Build Your Future with AI-Driven Personalized Resume
        </motion.p>
      </motion.div>
      <motion.div
        className="w-full lg:w-1/2 flex justify-center items-center px-4 lg:px-0"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      >
        <SignupForm />
      </motion.div>
    </div>
  );
}

