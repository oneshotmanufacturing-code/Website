import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* CableLeader-inspired palette */
        navy:           "#0F1D3F",
        "navy-dark":    "#091530",
        amber:          "#F7941D",
        "amber-hover":  "#E08319",
        "amber-light":  "#FFF3E0",
        "gray-100-cl":  "#F5F5F5",
        "gray-300-cl":  "#E0E0E0",
        "text-dark":    "#1A1A1A",
        "text-mid":     "#555555",
        "text-light":   "#AAAAAA",
        /* Legacy aliases kept so nothing else breaks */
        black:          "#FFFFFF",
        "dark-1":       "#F5F5F5",
        "dark-2":       "#F0F0F0",
        "dark-3":       "#E0E0E0",
        dim:            "#AAAAAA",
        grey:           "#555555",
        "white-text":   "#1A1A1A",
        red:            "#F7941D",
        "red-hover":    "#E08319",
        "red-dim":      "#FFF3E0",
      },
      fontFamily: {
        body:    ["var(--font-body)", "Inter", "Roboto", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in":        "fadeIn 0.6s ease-out forwards",
        "fade-in-up":     "fadeInUp 0.6s ease-out forwards",
        "fade-in-down":   "fadeInDown 0.5s ease-out forwards",
        "scale-in":       "scaleIn 0.4s ease-out forwards",
        "slide-in-left":  "slideInLeft 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn:       { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp:     { "0%": { opacity: "0", transform: "translateY(20px)" },  "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeInDown:   { "0%": { opacity: "0", transform: "translateY(-16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn:      { "0%": { opacity: "0", transform: "scale(0.94)" },       "100%": { opacity: "1", transform: "scale(1)" } },
        slideInLeft:  { "0%": { opacity: "0", transform: "translateX(-28px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        slideInRight: { "0%": { opacity: "0", transform: "translateX(28px)" },  "100%": { opacity: "1", transform: "translateX(0)" } },
      },
      boxShadow: {
        "card":      "0 1px 4px rgba(0,0,0,0.08)",
        "card-hover":"0 4px 16px rgba(0,0,0,0.12)",
        "nav":       "0 2px 8px rgba(0,0,0,0.15)",
      },
      borderRadius: {
        DEFAULT: "4px",
      },
      maxWidth: {
        "site": "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
