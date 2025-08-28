/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#7A5C47",  // coffee
          ink: "#5A5047",      // gray-brown (text)
          accent: "#C9C2BA",   // warm gray
          bg: "#F5F0E8",       // light beige
          surface: "#FFFFFF",  // panels/cards
        },
      },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.08)" },
      borderRadius: { xl2: "1rem" },
    },
  },
  plugins: [],
}
