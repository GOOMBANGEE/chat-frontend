/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#579DFF",
        menuBlue: "#1C2B41",
        backgroundBlack: "#1D2125",
        customGray: "#A6C5E229",
        customDarkGray: "#282E33",
        menuGray: "#3F434E",
        modalGray: "#252728",
        textGray: "#B6C2CF",
        customPurple: "#ABB0F2",
      },
    },
  },
  plugins: [],
};
