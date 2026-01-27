module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0EA5A4",        // xanh ngọc tươi
        primarySoft: "#E6F7F7",    // nền nhạt dịu
        backgroundLight: "#FFFFFF", // nền sáng
        backgroundDark: "#E6F7F7",  // nền nhạt (dark mode tạm thời dùng nhạt dịu)
        surfaceLight: "#F9FAFB",    // surface cards
        surfaceDark: "#E6F7F7",     // surface cards dark mode
        borderLight: "#D1D5DB",     // viền nhẹ
        borderDark: "#B2DFDB",      // viền dark
        textPrimary: "#101818",     // text chính
        textMuted: "#6B7280",       // text phụ
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
