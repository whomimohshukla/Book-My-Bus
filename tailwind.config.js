/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    colors: {
      Darkgreen: "#349E4D",
      LightGreen: "#88CCA6",
      grayWhite: "#FFFFFF",
      grayText: "#424248",
      black: "#424248",
      blue:"#1D293F"
    },
  },
  plugins: [],
};
