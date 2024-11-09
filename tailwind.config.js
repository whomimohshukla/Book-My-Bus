/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    colors: {
      Darkgreen: "#FB607F",
      LightGreen: "#88CCA6",
      grayWhite: "#FFFFFF",
      white2:"#F7F7F7",
      // navwhite: "#FFFFFF",
      grayText: "#424248",
      black: "#424248",
      black2: "#000000",
      blue: "#1D293F",
      busColor: "#71ACBC",
      simon: "#FF91A4",
      pink100: "#FFA6C9",
    },
  },
  plugins: [],
};
