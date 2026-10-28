/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        halaman: "#F2F5FA",
        navy: { DEFAULT: "#142849", 700: "#1C3560" },
        utama: { DEFAULT: "#214A9B", gelap: "#1A3C80", muda: "#E8EEF9" },
        sigma: "#F5C518",
        madu: { DEFAULT: "#FFF4CC", tua: "#F5B700" },
        jingga: { DEFAULT: "#F2841B", muda: "#FFE6CC", tua: "#B8520A" },
        tinta: "#1B2537",
        redup: "#5B6880",
        garis: "#DCE3EE",
        benar: { DEFAULT: "#1E7F4F", muda: "#E6F4EC" },
        salah: { DEFAULT: "#C0392B", muda: "#FCEBE9" },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        kartu: "0 1px 2px rgba(20,40,73,.06), 0 8px 24px rgba(20,40,73,.06)",
      },
    },
  },
  plugins: [],
};
