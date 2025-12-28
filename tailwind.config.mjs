// tailwind.config.js

// ESM Imports
import defaultTheme from 'tailwindcss/defaultTheme';
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
    extend: {
      // --- CUSTOM COLORS (Design Tokens for Collab-vertex) ---
      colors: {
        // PRIMARY (Trust, Security, Professionalism: Deep Navy Blue)
        primary: {
          lighter: '#3C4858',
          DEFAULT: '#102A43',
          darker: '#0A1C2C',
        },

        // SECONDARY/ACCENT (Creativity, Efficiency, CTAs: Vibrant Teal)
        accent: {
          100: '#D5F1EF',
          DEFAULT: '#2BB4A9',
          dark: '#1B9A93',
        },

        // NEUTRALS & SEMANTICS
        background: '#F0F4F8',
        card: '#FFFFFF',
        text: {
          DEFAULT: '#626D7A',
          heading: '#102A43',
          'on-primary': '#FFFFFF',
        },

        // STATUS COLORS
        success: '#4CAF50',
        warning: '#FFA000',
        danger: '#D32F2F',
        info: '#2196F3',
      },

      // --- CUSTOM FONT STACK ---
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },

      // --- CUSTOM BREAKPOINTS ---
      screens: {
        'xs': '475px',
        ...defaultTheme.screens,
      },

      // --- CUSTOM SHADOWS ---
      boxShadow: {
        'card': '0 4px 10px rgba(16, 42, 67, 0.1)',
        'heavy': '0 15px 30px rgba(16, 42, 67, 0.15)',
      }
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