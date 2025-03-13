module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'Sans', 'Arial', 'sans-serif'],  // Add Open Sans font
      },
      colors: {
        // Your custom colors
      },
      backgroundImage: {
        purpleGradient: "linear-gradient(to right, #ff6600, #9146ff)",
      },
    },
  },
  plugins: [],
};
