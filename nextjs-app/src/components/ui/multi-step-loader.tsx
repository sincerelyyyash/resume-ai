"use client";
// import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
}: {
  loadingStates: { text: string }[];
  loading: boolean;
  duration?: number;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % loadingStates.length);
    }, duration);
    return () => clearInterval(interval);
  }, [loading, duration, loadingStates.length]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute h-20 w-20 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
              <div className="absolute h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-300"></div>
              <div className="absolute h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-200"></div>
            </div>
            <div className="mt-4 text-center">
              <motion.div
                key={currentState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-lg font-medium text-white"
              >
                {loadingStates[currentState].text}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
