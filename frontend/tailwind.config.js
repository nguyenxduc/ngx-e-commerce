/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },

  daisyui: {
    themes: [
      {
        light: {
          primary: "#3b82f6",
          secondary: "#8b5cf6",
          accent: "#06b6d4",
          neutral: "#374151",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
        dark: {
          primary: "#3b82f6",
          secondary: "#8b5cf6",
          accent: "#06b6d4",
          neutral: "#374151",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#374151",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};
