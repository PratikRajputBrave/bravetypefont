/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          bg: "#FAF7F2",
          cream: "#F7F3EC",
          card: "#FFFFFF",
          border: "#EFE8DD",
          borderDark: "#E2D9CB"
        },
        accent: {
          orange: "#E86A33",
          orangeHover: "#D55923",
          orangeLight: "#FDF1EB"
        },
        charcoal: {
          main: "#2C2825",
          muted: "#78716C",
          subtle: "#A8A29E"
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'paper-sm': '0 1px 3px rgba(44, 40, 37, 0.04), 0 1px 2px rgba(44, 40, 37, 0.02)',
        'paper-md': '0 4px 12px rgba(44, 40, 37, 0.06), 0 1px 4px rgba(44, 40, 37, 0.03)',
        'paper-lg': '0 12px 32px rgba(44, 40, 37, 0.08), 0 2px 8px rgba(44, 40, 37, 0.04)',
      }
    },
  },
  plugins: [],
}
