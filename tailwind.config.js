/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4CAF50",
        accent: "#FF8C00",
        background: {
          light: "#FFFFFF",
          dark: "#121212"
        },
        text: {
          light: "#212121",
          dark: "#FFFFFF"
        },
        card: {
          shadow: "rgba(0,0,0,0.1)"
        }
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "inter-medium": ["Inter-Medium", "sans-serif"],
        "inter-semibold": ["Inter-SemiBold", "sans-serif"]
      },
      fontSize: {
        h1: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        h2: ["20px", { lineHeight: "28px", fontWeight: "500" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        caption: ["14px", { lineHeight: "20px", fontWeight: "400" }]
      },
      spacing: {
        grid: "8px"
      },
      borderRadius: {
        card: "12px"
      },
      animation: {
        "scale-press": "scale-press 150ms ease-in-out",
        "ripple": "ripple 600ms ease-out"
      }
    }
  },
  plugins: []
}