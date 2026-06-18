export const easings = {
  // Apple-like spring/fluid ease
  fluid: [0.22, 1, 0.36, 1],
  // Sharp but smooth deceleration
  expoOut: [0.16, 1, 0.3, 1],
  // Traditional ease in out
  inOutQuart: [0.76, 0, 0.24, 1],
  // Snappy spring config
  spring: { type: "spring", stiffness: 100, damping: 20 },
}

export const durations = {
  fast: 0.3,
  base: 0.6,
  slow: 1.2,
}

// Global variants for staggering and reveals
export const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },
  maskReveal: {
    initial: { y: "110%" },
    animate: { y: 0 },
    exit: { y: "-110%" },
  }
}
