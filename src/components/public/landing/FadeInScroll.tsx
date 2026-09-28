"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const SOFT_EASE = [0.16, 1, 0.3, 1] as const;

export function FadeInScroll({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: "200px 0px 200px 0px" }}
      transition={{
        duration: 0.42,
        delay,
        ease: SOFT_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
