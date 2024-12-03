/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(input|navbar).js"
  ],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: "#349E4D",    // Main green
          50: "#E8F5EA",        // Lightest green
          100: "#D1EBD6",       // Very light green
          200: "#A3D7AD",       // Light green
          300: "#88CCA6",       // Previously LightGreen
          400: "#5BB176",       // Medium-light green
          500: "#349E4D",       // Default green
          600: "#2A7E3E",       // Medium-dark green
          700: "#1F5E2E",       // Dark green
          800: "#153F1F",       // Very dark green
          900: "#0A1F0F",       // Darkest green
          light: "#88CCA6",     // Alias for 300
          dark: "#1F5E2E",      // Alias for 700
          hover: "#2A7E3E"      // Alias for 600
        },
        // Secondary Colors
        secondary: {
          DEFAULT: "#71ACBC",   // Main blue
          50: "#F0F6F8",        // Lightest blue
          100: "#E1EEF1",       // Very light blue
          200: "#C3DDE3",       // Light blue
          300: "#A5CCD5",       // Medium-light blue
          400: "#87BBC7",       // Medium blue
          500: "#71ACBC",       // Default blue
          600: "#5A8A96",       // Medium-dark blue
          700: "#436770",       // Dark blue
          800: "#2C454A",       // Very dark blue
          900: "#152225",       // Darkest blue
          light: "#A5CCD5",     // Alias for 300
          dark: "#436770"       // Alias for 700
        },
        // Neutral Colors
        neutral: {
          white: "#FFFFFF",
          offWhite: "#F7F7F7",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          black: "#000000"
        },
        // Status Colors
        status: {
          success: {
            DEFAULT: "#22C55E",
            light: "#4ADE80",
            dark: "#16A34A"
          },
          warning: {
            DEFAULT: "#F59E0B",
            light: "#FBBF24",
            dark: "#D97706"
          },
          error: {
            DEFAULT: "#EF4444",
            light: "#F87171",
            dark: "#DC2626"
          },
          info: {
            DEFAULT: "#3B82F6",
            light: "#60A5FA",
            dark: "#2563EB"
          }
        },
        // Extended UI Colors
        emerald: {
          800: "#065F46",
          900: "#064E3B"
        },
        // Legacy Colors (for backward compatibility)
        Darkgreen: "#349E4D",
        LightGreen: "#88CCA6",
        grayWhite: "#FFFFFF",
        white2: "#F7F7F7",
        grayText: "#424248",
        black: "#424248",
        black2: "#000000",
        blue: "#1D293F",
        busColor: "#71ACBC",
        simon: "#88CCA6",
        pink100: "#88CCA6",
        indigo600: "#3949AB"
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '85': '0.85',
      },
      backgroundOpacity: {
        '15': '0.15',
        '35': '0.35',
        '85': '0.85',
      }
    }
  },
  plugins: [nextui()],
};
