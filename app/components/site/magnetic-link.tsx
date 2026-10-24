"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { PointerEvent, ReactNode } from "react";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * A restrained pointer response reserved for a small number of high-intent CTAs.
 * The link itself keeps its normal hit area; only its contents move.
 */
export function MagneticLink({ href, children, className }: MagneticLinkProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 19, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 19, mass: 0.35 });

  function resetPosition() {
    x.set(0);
    y.set(0);
  }

  function moveTowardPointer(event: PointerEvent<HTMLAnchorElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 10);
    y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 8);
  }

  return (
    <Link
      href={href}
      className={className}
      onPointerMove={moveTowardPointer}
      onPointerLeave={resetPosition}
      onBlur={resetPosition}
    >
      <motion.span
        className="inline-flex items-center gap-2"
        style={{ x: springX, y: springY }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
