"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, animate, motion } from "framer-motion";

interface CounterProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * A smooth count-up animation component using Framer Motion.
 * Optimized for performance by avoiding re-renders during animation.
 */
export default function Counter({
  to,
  from = 1,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
}: CounterProps) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => {
    // Format the number with commas for readability (e.g., 1,000,000)
    return Math.floor(latest).toLocaleString();
  });

  const ref = useRef(null);
  // Trigger animation when component is 10% into the viewport
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration: duration,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a "premium" feel (smooth deceleration)
      });
      return controls.stop;
    }
  }, [isInView, count, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
