/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "var(--midnight)",
        navy: "var(--navy)",
        ink: "var(--ink)",
        teal: {
          DEFAULT: "var(--teal)",
          dark: "var(--teal-dark)",
          pale: "var(--teal-pale)",
        },
        // Un-nested so `bg-green` and `text-red` work correctly
        green: {
          DEFAULT: "var(--green)",
          pale: "var(--green-pale)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          pale: "var(--amber-pale)",
        },
        red: {
          DEFAULT: "var(--red)",
          pale: "var(--red-pale)",
        },
        blue: {
          DEFAULT: "var(--blue)",
          pale: "var(--blue-pale)",
        },
        surface: "var(--surface)",
        card: "var(--card)",
        // Un-nested so `border-border` works properly
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        muted: "var(--muted)",
        slate: "var(--slate)",
        body: "var(--body)",
        "data-bg": "var(--data-bg)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        data: "var(--font-data)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [],
}