// src/animations/authAnimations.ts
import { Variants } from "framer-motion";

export const slideVariants: Variants = {
  hidden: {
    x: "-100%",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};
