'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionDivProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  whileInView?: any;
  transition?: any;
  viewport?: any;
}

export const MotionDiv = ({
  children,
  className,
  initial,
  animate,
  whileInView,
  transition,
  viewport,
}: MotionDivProps) => {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      transition={transition}
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}; 