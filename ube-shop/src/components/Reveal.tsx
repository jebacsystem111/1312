"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Wejście na scroll. Cel: hierarchia - sekcja pojawia się, gdy wchodzi w kadr,
 * a nie po to, żeby coś się ruszało.
 * Krzywa ease-out, 30-70 ms stagger, przy prefers-reduced-motion zostaje sam fade.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 16,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, transform: `translateY(${distance}px) scale(0.99)` }
      }
      whileInView={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: reduce ? 0.2 : 0.55,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

/** Pojedynczy kadr hero - wjeżdża od razu po zamontowaniu, bez czekania na scroll. */
export function RevealOnMount({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(14px) scale(0.985)" }}
      animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      transition={{ duration: reduce ? 0.2 : 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
