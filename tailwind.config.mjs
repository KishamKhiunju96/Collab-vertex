// tailwind.config.js

// ESM Imports
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
// FIX: Assign the config object to a variable before using 'export default'
const config = {
  // --- CORE CONFIG ---
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],

  darkMode: 'class',


  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },

    extend: {
      colors: {
        /* ==============================
           Brand Colors
        =============================== */
        brand: {
          primary: "#6366F1", // Indigo (main brand)
          secondary: "#22C55E", // Emerald (accent / success)
          accent: "#A855F7", // Violet highlight
        },

        /* ==============================
           Background Colors
        ============================== */
        background: {
          /* App Surfaces */
          base: "#FFFFFF",        // Root background (pure white)
          // light: "#E0FFFF",
          light: "#DBD7D2",// Main app background (light cyan)
          subtle: "#F1F5F9",      // Light section separation
          muted: "#E2E8F0",       // Borders / dividers / soft blocks

          /* Cards & Containers */
          card: "#FFFFFF",        // Card background (light)
          cardMuted: "#F8FAFC",   // Card variation
          elevated: "#F9FAFB",    // Elevated surfaces

          /* Dark Mode / Dark Sections */
          dark: "#020617",        // App background (dark)
          darkSoft: "#020617CC",  // Dark with transparency
          darkCard: "#0F172A",    // Dark cards / modals
          darkMuted: "#1E293B",   // Dark section separation

          /* Image & Overlay Backgrounds */
          overlayLight: "rgba(255, 255, 255, 0.6)", // Light overlay
          overlayDark: "rgba(2, 6, 23, 0.6)",       // Dark overlay

          /* Special Use */
          glass: "rgba(255, 255, 255, 0.4)", // Glassmorphism
        },
        /* ==============================
           Text Colors
        =============================== */
        text: {
          primary: "#0F172A",   // Main text (light bg)
          secondary: "#FFFFFF", // Headings / strong text on dark

          tertiary: "#CBD5E1",  // 🔥 Soft text for image overlays
          // tertiary: "#94A3B8", // Slate-400


          inverse: "#E5E7EB",   // Body text on dark
          muted: "#475569",     // Low-emphasis text
          link: "#6366F1",
        },


        /* ==============================
           Button Colors
        =============================== */
        button: {
          primary: "#43B3AE",
          primaryHover: "#20B2AA",
          secondary: "#22C55E",
          secondaryHover: "#16A34A",
          danger: "#EF4444",
          dangerHover: "#DC2626",
          disabled: "#CBD5E1",
        },

        /* ==============================
           Border & Divider
        =============================== */
        border: {
          light: "#E2E8F0",
          dark: "#1E293B",
        },
      },

      /* ==============================
         Typography
      =============================== */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      /* ==============================
         Radius
      =============================== */
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },

      /* ==============================
         Shadows
      =============================== */
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        card: "0 4px 20px rgba(0,0,0,0.12)",
      },

      /* ==============================
         Animations
      =============================== */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },

  // --- PLUGINS ---
  plugins: [
    typography,
    forms,
    aspectRatio,
  ],
};

// Export the assigned variable
export default config;
