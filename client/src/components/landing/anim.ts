import type { Variants } from 'framer-motion';

export const EASE = [0.23, 1, 0.32, 1] as const;

// section headers / single blocks: fade-up on scroll into view
export const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// parent for grids/lists whose children fade-up one by one
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const viewport = { once: true, amount: 0.2 } as const;
