'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionDivProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export const MotionDiv = ({
  children,
  className,
  ...motionProps
}: MotionDivProps) => {
  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
};
