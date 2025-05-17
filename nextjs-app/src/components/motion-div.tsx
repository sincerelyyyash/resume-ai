
"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const MotionDiv: React.FC<MotionDivProps> = ({ children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MotionDiv;
