const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", ".light"],
  safelist: ["light", "dark"],
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "cursive"],
      },
      colors: {
        background: "#FFFFFF",
        mainContent: "#F0F4F8",
        buttonPrimary: "#7E57C2",
        buttonSecondary: "#9575CD",
        dropdownButton: "#7C4DFF",
        contentBackground: "#FAFAFA",
        buttonVariant: "#5C6BC0", // Indigo
        buttonSuccess: "#4CAF50", // ✅ Success green
        buttonDanger: "#F44336", // ❌ Not removed
        textVariant1: "#78909C",
        textVariant2: "#546E7A",
        textPrimary: "#212121",
        alertSuccessBg: "#388E3C", // ✅
        alertSuccessEffect: "#2E7D32", // ✅
        alertErrorBg: "#D32F2F", // ✅
        alertErrorEffect: "#C62828", // ✅
        alertInfoBg: "#1976D2", // ✅
        alertInfoEffect: "#1565C0", // ✅
        alertWarningBg: "#FBC02D", // ✅
        alertWarningEffect: "#F9A825", // ✅
        shadow: "#424242",
        listOption: "#7E57C2", // Before: #FF9800
        listOptionEffect: "#9575CD", // Before: #FEA33B
        orderSuccessBg: "#43A047", // ✅
        tableCellBg: "#E0E0E0",
        stateOptionBg: "#388E3C", // Before: #388E3C
        tableActionBg: "#455A64",
        buttonVariantSecondary: "#B39DDB", // Before: #FFEB3B
        textVariant3: "#512DA8", // Indigo
        textVariant4: "#212121",
        stateVariant: "#8E24AA", // ✅ Fix
        buttonVariantTertiary: "#7C4DFF", 
        contentButton: "#F5F5F5",

        // Dark mode
        "background": "#121212",
        "dark-background/50": "rgba(18, 18, 18, 0.5)",
        "dark-background/70": "rgba(18, 18, 18, 0.7)",
        "dark-mainContent": "#1C1C1C",
        "dark-buttonPrimary": "#9575CD",
        "dark-buttonSecondary": "#B39DDB",
        "dark-bg-primary": "#4A148C",
        "dark-dropdownButton": "#B388FF",
        "dark-contentBackground": "#212121",
        "dark-textPrimary": "#E0E0E0",
        "dark-alertSuccessBg": "#43A047", // ✅
        "dark-alertErrorBg": "#EF5350", // ✅
        "dark-alertInfoBg": "#42A5F5", // ✅
        "dark-alertWarningBg": "#FFA726", // ✅
        "dark-shadow": "#000000",
        "dark-skeleton": "#2A2A2A",
        "dark-listOption": "#B39DDB",
        "dark-listOptionEffect": "#D1C4E9",
        "dark-orderSuccessBg": "#43A047", // ✅
        "dark-tableCellBg": "#424242",
        "dark-stateOptionBg": "#9575CD",
        "dark-tableActionBg": "#455A64",
        "dark-buttonVariantSecondary": "#D1C4E9",
        "dark-textVariant3": "#7E57C2",
        "dark-textVariant4": "#E0E0E0",
        "dark-stateVariant": "#8E24AA", // ✅
        "dark-buttonVariantTertiary": "#B388FF",
        "dark-contentButton": "#2A2A2A",
        "dark-mainContent/50": "rgb(103 102 102)",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
      },
      gradientButton: {
        "button-gradient": "linear-gradient(to right, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [animate],
};