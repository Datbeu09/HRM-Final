import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Chuyển tất cả yêu cầu từ frontend đến backend API
      '/api': 'http://localhost:5000',  // Backend API URL
    },
  },
  build: {
    // Các cấu hình build nếu cần
  }
});
