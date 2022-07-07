/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: {
          // 700: "#1C1C1C",
          700: "#090909",
          800: "#121212",
          900: "#000000",
        },
        gray: {
          primary: "#787878",
        },
      },
    },
  },
  plugins: [],
};
