/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0A0D12",
          card: "#121721",
          border: "#1E2638",
          primary: "#10B981",
          accent: "#38BDF8",
        }
      }
    },
  },
  plugins: [],
};
