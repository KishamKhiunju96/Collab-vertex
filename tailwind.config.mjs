// tailwind.config.js

import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },

    extend: {
      /* ==============================
         ANIMATIONS & KEYFRAMES
      =============================== */
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(147, 51, 234, 0.8)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "scale-in": {
          from: { transform: "scale(0.9)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 15s ease infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-in",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-out-left": "slide-out-left 0.3s ease-in",
        "scale-in": "scale-in 0.2s ease-out",
        bounce: "bounce 1s ease-in-out infinite",
      },
      /* ==============================
         BRAND COLORS (LOUD)
      =============================== */
      colors: {
        brand: {
          primary: "#6C5CE7", // Electric Violet
          accent: "#FF7675", // Coral Pink
          secondary: "#2ED8B6", // Mint Teal
          highlight: "#FDCB6E", // Soft Gold
        },

        /* ==============================
           BACKGROUNDS (LIGHT & JOYFUL)
        =============================== */
        background: {
          hero: "#F9F8FF",
          alternate: "#FFF5F5",
          highlight: "#F1FFFA",

          app: "#FAFAFC",
          card: "#FFFFFF",
          surface: "#F3F4F8",

          muted: "#F1F5F9",
          disabled: "#EEF0F4",

          overlayLight: "rgba(255,255,255,0.6)",
          overlayDark: "rgba(31,41,55,0.6)",
        },

        /* ==============================
           TEXT (WCAG AA+)
        =============================== */
        text: {
          primary: "#1F2937",
          secondary: "#4B5563",
          muted: "#9CA3AF",
          disabled: "#CBD5E1",
          inverse: "#FFFFFF",

          brand: "#6C5CE7",
          success: "#16A34A",
          warning: "#D97706",
          error: "#DC2626",
        },

        /* ==============================
           BUTTON SYSTEM
        =============================== */
        button: {
          primary: {
            DEFAULT: "#6C5CE7",
            hover: "#5A4BD8",
            active: "#4B3FC4",
            disabled: "#C7C3F4",
            text: "#FFFFFF",
          },

          secondary: {
            DEFAULT: "#FF7675",
            hover: "#FF5C5B",
            active: "#E84C4B",
            text: "#FFFFFF",
          },

          tertiary: {
            border: "#6C5CE7",
            hover: "#F1EEFF",
            active: "#E6E1FF",
            text: "#6C5CE7",
          },
        },

        /* ==============================
           BORDERS & DIVIDERS
        =============================== */
        border: {
          subtle: "#E5E7EB",
          accent: "#DAD7FE",
        },

        /* ==============================
           ICON COLORS
        =============================== */
        icon: {
          default: "#6B7280",
          active: "#6C5CE7",
          muted: "#9CA3AF",
          success: "#22C55E",
          error: "#EF4444",
        },

        /* ==============================
           STATUS / BADGES
        =============================== */
        status: {
          successBg: "#DCFCE7",
          successText: "#166534",

          warningBg: "#FEF3C7",
          warningText: "#92400E",

          errorBg: "#FEE2E2",
          errorText: "#991B1B",

          infoBg: "#E0E7FF",
          infoText: "#3730A3",
        },
      },

      /* ==============================
         TYPOGRAPHY
      =============================== */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      /* ==============================
         RADIUS
      =============================== */
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },

      /* ==============================
         SHADOWS (SOFT, PLAYFUL)
      =============================== */
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.04)",
        sm: "0 2px 6px rgba(0,0,0,0.06)",
        md: "0 4px 16px rgba(108,92,231,0.12)",
        lg: "0 12px 30px rgba(108,92,231,0.18)",
        card: "0 4px 20px rgba(0,0,0,0.08)",
      },

      /* ==============================
         INTERACTION STATES
      =============================== */
      ringColor: {
        focus: "#FDCB6E",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      backgroundColor: {
        hoverFade: "rgba(108,92,231,0.08)",
        tableHover: "#F8FAFF",
        selected: "#F1EEFF",
      },

      /* ==============================
         BACKDROP BLUR & FILTERS
      =============================== */
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },

      /* ==============================
         Z-INDEX SCALE
      =============================== */
      zIndex: {
        dropdown: "40",
        sticky: "50",
        overlay: "60",
        modal: "70",
        tooltip: "80",
      },

      /* ==============================
         SCALE TRANSFORMS
      =============================== */
      scale: {
        98: "0.98",
        102: "1.02",
      },

      /* ==============================
         SPACING EXTENSIONS
      =============================== */
      spacing: {
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
      },

      /* ==============================
         BACKGROUND PATTERNS
      =============================== */
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
        "grid-white":
          "linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
        "gradient-primary": "linear-gradient(135deg, #6C5CE7 0%, #5A4BD8 100%)",
        "gradient-accent": "linear-gradient(135deg, #FF7675 0%, #E84C4B 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #6C5CE7 0%, #FF7675 50%, #2ED8B6 100%)",
        "gradient-footer":
          "linear-gradient(to bottom, #f9f8ff 0%, #ffffff 50%, #fff5f5 100%)",
      },

      /* ==============================
         BACKGROUND SIZE
      =============================== */
      backgroundSize: {
        "grid-sm": "40px 40px",
        "grid-md": "50px 50px",
        "grid-lg": "60px 60px",
        "200%": "200% 200%",
      },
    },
  },

  plugins: [
    typography,
    forms,
    aspectRatio,
    // Custom plugin for additional utilities
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-gradient": {
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".bg-glass": {
          "background-color": "rgba(255, 255, 255, 0.8)",
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
        },
        ".bg-glass-dark": {
          "background-color": "rgba(31, 41, 55, 0.8)",
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
        },
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".transition-smooth": {
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
