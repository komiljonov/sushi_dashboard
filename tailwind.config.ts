import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Default (light mode) colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        
        // Dark mode overrides (use black instead of gray)
        'background-dark': 'hsl(0, 0%, 0%)', // pure black
        'foreground-dark': 'hsl(0, 0%, 100%)', // pure white for text contrast
        'card-dark': {
          DEFAULT: 'hsl(0, 0%, 10%)', // near-black for cards
          foreground: 'hsl(0, 0%, 90%)', // light text on dark cards
        },
        'popover-dark': {
          DEFAULT: 'hsl(0, 0%, 10%)', // dark popover background
          foreground: 'hsl(0, 0%, 90%)', // light text on popover
        },
        'primary-dark': {
          DEFAULT: 'hsl(0, 0%, 15%)', // slightly lighter black for primary elements
          foreground: 'hsl(0, 0%, 100%)', // white text on primary elements
        },
        'secondary-dark': {
          DEFAULT: 'hsl(0, 0%, 20%)',
          foreground: 'hsl(0, 0%, 85%)',
        },
        'muted-dark': {
          DEFAULT: 'hsl(0, 0%, 30%)',
          foreground: 'hsl(0, 0%, 70%)',
        },
        'accent-dark': {
          DEFAULT: 'hsl(0, 0%, 25%)',
          foreground: 'hsl(0, 0%, 80%)',
        },
        'destructive-dark': {
          DEFAULT: 'hsl(0, 0%, 5%)',
          foreground: 'hsl(0, 0%, 95%)',
        },
        'border-dark': 'hsl(0, 0%, 15%)',
        'input-dark': 'hsl(0, 0%, 20%)',
        'ring-dark': 'hsl(0, 0%, 25%)',
        'chart-dark': {
          '1': 'hsl(0, 0%, 10%)',
          '2': 'hsl(0, 0%, 15%)',
          '3': 'hsl(0, 0%, 20%)',
          '4': 'hsl(0, 0%, 25%)',
          '5': 'hsl(0, 0%, 30%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
