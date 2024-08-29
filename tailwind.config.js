/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        defaultBackground: "#333333",
        customBlue: "#579DFF",
        menuBlue: "#1C2B41",
        serverListSidebar: "#1D2125",
        serverChatSidebar: "#252728",
        serverChatUserList: "#252728",
        serverChatUserInfo: "#1D2125",
        serverSearchbar: "#1D2125",
        inputBackground: "#1D2125",
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
