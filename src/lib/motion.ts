// Standard animation variants for Framer Motion
// Use these everywhere instead of defining inline variants

export const MOTION = {
  // Standard durations (in seconds)
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
    emphasis: 0.6,
  },

  // Standard easings
  ease: {
    default: [0.25, 0.1, 0.25, 1.0] as const,     // CSS ease equivalent
    decelerate: [0.0, 0.0, 0.2, 1.0] as const,     // MD3 standard decelerate
    accelerate: [0.3, 0.0, 1.0, 1.0] as const,     // MD3 standard accelerate
    spring: { type: "spring" as const, stiffness: 300, damping: 30 },
    springGentle: { type: "spring" as const, stiffness: 200, damping: 25 },
  },

  // Reusable animation variants
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25 },
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  },

  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  },

  slideUp: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: { type: "spring", damping: 30, stiffness: 300 },
  },

  slideInRight: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: { duration: 0.25 },
  },

  // Stagger container for lists
  staggerContainer: (staggerDelay = 0.05) => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }),

  staggerItem: {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  },

  // Page/section scroll reveal
  scrollReveal: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  },

  // Popover/tooltip animations
  popover: {
    initial: { opacity: 0, y: 8, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.95 },
    transition: { duration: 0.15 },
  },

  // Micro-interactions
  tap: { scale: 0.97 },
  hover: { scale: 1.02 },
} as const;

// Helper for consistent CSS transition classes
export const TRANSITION = {
  fast: "transition-all duration-150 ease-out",
  normal: "transition-all duration-250 ease-out",
  slow: "transition-all duration-400 ease-out",
  colors: "transition-colors duration-200",
  transform: "transition-transform duration-200",
  shadow: "transition-shadow duration-300",
} as const;
