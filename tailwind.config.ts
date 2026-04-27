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
        black: 'var(--black)',
        'dark-1': 'var(--dark-1)',
        'dark-2': 'var(--dark-2)',
        'dark-3': 'var(--dark-3)',
        dim: 'var(--dim)',
        grey: 'var(--grey)',
        'white-text': 'var(--white-text)',
        red: 'var(--red)',
        'red-hover': 'var(--red-hover)',
        'red-dim': 'var(--red-dim)',
      },
      fontFamily: {
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
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
        "glow-pulse":     "glowPulse 3s ease-in-out infinite",
        "float":          "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:       { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp:     { "0%": { opacity: "0", transform: "translateY(20px)" },  "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeInDown:   { "0%": { opacity: "0", transform: "translateY(-16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn:      { "0%": { opacity: "0", transform: "scale(0.94)" },       "100%": { opacity: "1", transform: "scale(1)" } },
        slideInLeft:  { "0%": { opacity: "0", transform: "translateX(-28px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        slideInRight: { "0%": { opacity: "0", transform: "translateX(28px)" },  "100%": { opacity: "1", transform: "translateX(0)" } },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212,168,71,0.08)" },
          "50%":       { boxShadow: "0 0 40px rgba(212,168,71,0.20)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 16px rgba(212,168,71,0.18)",
        "glow-md": "0 0 28px rgba(212,168,71,0.24)",
        "glow-lg": "0 0 52px rgba(212,168,71,0.28)",
        "glass":   "0 8px 32px rgba(0,0,0,0.35)",
        "card":    "0 4px 20px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
