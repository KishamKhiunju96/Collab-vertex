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
         BRAND COLORS (LOUD)
      =============================== */
      colors: {
        brand: {
          primary: "#6C5CE7",     // Electric Violet
          accent: "#FF7675",      // Coral Pink
          secondary: "#2ED8B6",   // Mint Teal
          highlight: "#FDCB6E",   // Soft Gold
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
    },
  },

  plugins: [typography, forms, aspectRatio],
};

export default config;
