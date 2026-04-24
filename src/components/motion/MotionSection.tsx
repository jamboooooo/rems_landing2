import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { fadeInUp } from '@/lib/motion';

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
};

export function MotionSection({ children, className }: MotionSectionProps) {
  return (
    <motion.section className={className} {...fadeInUp}>
      {children}
    </motion.section>
  );
}
