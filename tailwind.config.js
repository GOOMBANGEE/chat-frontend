/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customDark_0: "#1E1F22",
        customDark_1: "#25262A",
        customDark_2: "#2B2D31",
        customDark_3: "#2F3135", // default background
        customDark_4: "#323439",
        customDark_5: "#383A40",
        customDark_6: "#4A4C51",

        customGray_0: "#4E5058",
        customGray_1: "#5E6068",
        customGray_2: "#6D6F78",
        customGray_3: "#8F939B",
        customGray_4: "#B1B7BE",

        customText: "#EBEBEB",
      },
    },
  },
  plugins: [],
};
