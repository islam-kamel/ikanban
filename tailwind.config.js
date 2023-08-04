/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgba(23,23,23,0.85)",
        dark: "#0e0d0d",
        secondary: "rgba(243,79,41,0.85)",
        buttonHoverBorderColor: "rgba(243,79,41,0.85)",
        light: "rgba(255, 255, 255, 0.87)",
        muted: "#888"
      },
      fontFamily: {
        kanban: ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

