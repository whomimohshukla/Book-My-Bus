const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(input|navbar).js"
  ],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    colors: {
      Darkgreen: "#349E4D",
      LightGreen: "#88CCA6",
      grayWhite: "#FFFFFF",
      white2:"#F7F7F7",
      // navwhite: "#FFFFFF",
      grayText: "#424248",
      black: "#424248",
      black2: "#000000",
      blue: "#1D293F",
      busColor: "#71ACBC",
      simon: "#88CCA6",
      pink100: "#88CCA6",
      indigo600:"#3949AB"
    },
  },
  plugins: [nextui()],
};
